
'use client'
import { useEffect, useState } from 'react'
export default function Backroom(){
  const [pass,setPass]=useState('');const [ok,setOk]=useState(false)
  const [input,setInput]=useState('');const [last,setLast]=useState('');const [busy,setBusy]=useState(false)
  useEffect(()=>{const s=localStorage.getItem('backroom_pass')||'';if(s){setPass(s);setOk(true)}},[])
  async function submit(){
    setBusy(true)
    try{
      const res=await fetch('/api/staff/ingest',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+pass},body:JSON.stringify({message:input})})
      const json=await res.json();if(!json.ok) throw new Error(json.error||'error')
      setLast(JSON.stringify(json.summary,null,2));setInput('')
    }catch(e:any){alert('Failed: '+(e?.message||'unknown'))}finally{setBusy(false)}
  }
  return (<div className="container" style={{padding:'24px 0'}}>
    <h1 className="h1">Backroom — Staff Chat Ingest</h1>
    {!ok?<div className="card"><div className="muted">Passphrase</div>
      <input className="input" type="password" placeholder="enter staff passphrase" value={pass} onChange={e=>setPass(e.target.value)}/>
      <button className="btn" onClick={()=>{localStorage.setItem('backroom_pass',pass);setOk(true)}}>Continue</button></div>:
      <div className="card"><div className="muted" style={{fontSize:14}}>Write freely — it will extract structure.</div>
      <textarea className="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Extend GRAFFITI ESPERANTO to Nov 25. Espresso £2.50. Talk Nov 12 7pm."/>
      <button className="btn" disabled={busy} onClick={submit}>{busy?'Ingesting…':'Ingest'}</button>
      {last&&<><div style={{height:12}}/><pre className="wrap" style={{fontSize:12}}>{last}</pre></>}
    </div>}
  </div>)
}
