import type { Palette } from "../types/audio";
export function PalettePicker({palettes,selected,onSelect}:{palettes:Palette[];selected:string;onSelect:(id:string)=>void}){
 return <div className="grid grid-cols-3 gap-2">{palettes.map(p=><button key={p.id} onClick={()=>onSelect(p.id)} className={`rounded-xl border p-2 text-left ${selected===p.id?"border-white":"border-white/10"}`}>
   <div className="h-8 rounded-lg" style={{background:`linear-gradient(135deg,${p.primary},${p.secondary},${p.accent})`}}/>
   <div className="mt-2 text-xs">{p.name}</div>
 </button>)}</div>
}