import type { VisualizerStyle } from "../styles/types";
export function StyleGallery({styles,selected,onSelect}:{styles:VisualizerStyle[];selected:string;onSelect:(id:string)=>void}){
 return <div className="grid grid-cols-2 gap-2">{styles.map(s=><button key={s.id} onClick={()=>onSelect(s.id)} className={`group rounded-xl border p-2 text-left transition ${selected===s.id?"border-cyan-400 bg-cyan-400/5":"border-white/10 bg-white/[.02] hover:border-white/20"}`}>
   <div className="relative mb-2 aspect-[16/9] overflow-hidden rounded-lg bg-black"><div className="absolute inset-0 opacity-70" style={{background:"radial-gradient(circle at 30% 50%, #22d3ee55, transparent 35%), linear-gradient(135deg,#111827,#030712)"}}/><div className="absolute inset-x-2 top-1/2 h-px bg-cyan-300/60 shadow-[0_0_12px_#22d3ee]"/></div>
   <div className="text-xs font-semibold">{s.name}</div><div className="mt-1 line-clamp-2 text-[10px] text-white/40">{s.description}</div>
 </button>)}</div>
}