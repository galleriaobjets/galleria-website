
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { upsertFacts, addEvents } from '@/lib/knowledge'

const PASS = process.env.BACKROOM_PASSPHRASE || ''

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (!PASS || token !== PASS) {
    return NextResponse.json({ ok:false, error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const msg: string = body?.message || ''
  if (!msg) {
    return NextResponse.json({ ok:false, error: 'no message' }, { status: 400 })
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const instruction = `Extract structured gallery knowledge from the STAFF free-text below.
Return strictly JSON with two arrays: facts[] and events[].

facts[] items: { entity, attr, value, lang, tags[] }
events[] items: { title, datetime (ISO if possible), venue, description_en, description_it, tags[] }

- Prefer concise, plain language
- Detect languages automatically (facts.lang)
- Merge related facts into a single value when obvious
- Ignore personal/sensitive data
- Do not include commentary`

  try {
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Return only JSON. No markdown.' },
        { role: 'user', content: instruction + '\n\nSTAFF TEXT:\n' + msg }
      ],
      temperature: 0.2,
      max_tokens: 900
    })

    const text = res.choices?.[0]?.message?.content || '{"facts":[],"events":[]}'
    let parsed: any = { facts: [], events: [] }
    try { parsed = JSON.parse(text) } catch(e) { parsed = { facts: [], events: [] } }

    await upsertFacts(parsed.facts || [])
    await addEvents(parsed.events || [])

    return NextResponse.json({ ok:true, summary: { addedFacts: (parsed.facts||[]).length, addedEvents: (parsed.events||[]).length } })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 })
  }
}
