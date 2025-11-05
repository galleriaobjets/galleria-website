
import Link from 'next/link'
import { readKnowledge } from '@/lib/knowledge'
export default async function Home(){
  const k=await readKnowledge()
  return (<div>
    <div className="card" style={{border:'0',borderBottom:'1px solid #eee',borderRadius:0}}>
      <div className="container"><h1 className="h1">Galleria Objets — Living Site</h1>
      <p className="muted">Visitors see highlights; staff use <Link href="/backroom" className="underline">Backroom</Link>.</p></div>
    </div>
    <div className="container" style={{padding:'24px 0',display:'grid',gap:16,gridTemplateColumns:'1fr 1fr'}}>
      <div className="card"><div className="muted" style={{fontWeight:600}}>Highlights (facts)</div>
        <ul>{Array.isArray(k.facts)&&k.facts.length?k.facts.slice(0,8).map((f:any,i:number)=>(
          <li key={i}><b>{f.entity}</b> — {f.attr}: {f.value}</li>
        )):<li>No facts yet — add via Backroom.</li>}</ul>
      </div>
      <div className="card"><div className="muted" style={{fontWeight:600}}>Upcoming (events)</div>
        <ul>{Array.isArray(k.events)&&k.events.length?k.events.slice(0,8).map((e:any,i:number)=>(
          <li key={i}><b>{e.title}</b> — {new Date(e.datetime).toLocaleString()} @ {e.venue||'—'}</li>
        )):<li>No events yet — add via Backroom.</li>}</ul>
      </div>
      <div className="card" style={{gridColumn:'1 / span 2'}}>
        <Link className="btn" href="/backroom">Open Backroom (staff)</Link>
      </div>
    </div></div>)
}
