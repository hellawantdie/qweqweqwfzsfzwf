import { useRef, useState } from "react";

interface Props { onMidi:(f:File)=>void; onAudio:(f:File)=>void; }

export function FileDropZone({onMidi,onAudio}:Props){
  const input=useRef<HTMLInputElement>(null); const [over,setOver]=useState(false);
  const handle=(files:FileList)=>Array.from(files).forEach(f=>{
    if(/\.(mid|midi)$/i.test(f.name)) onMidi(f);
    else if(/\.(wav|mp3)$/i.test(f.name)||f.type==="audio/wav"||f.type==="audio/mpeg") onAudio(f);
  });
  return <div onClick={()=>input.current?.click()} onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();setOver(false);handle(e.dataTransfer.files)}}
    className={`cursor-pointer rounded-2xl border border-dashed p-8 text-center transition ${over?"border-cyan-400 bg-cyan-400/10":"border-white/10 bg-white/[.03] hover:border-white/20"}`}>
    <input ref={input} className="hidden" type="file" multiple accept=".mid,.midi,.wav,.mp3,audio/*" onChange={e=>e.target.files&&handle(e.target.files)}/>
    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">♪</div>
    <div className="font-semibold">Drop your loop here</div><div className="mt-1 text-xs text-white/40">MIDI, WAV or MP3</div>
  </div>
}