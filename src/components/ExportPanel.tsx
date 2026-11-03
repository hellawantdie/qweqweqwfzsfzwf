export function ExportPanel({exporting,progress,onExport}:{exporting:boolean;progress:number;onExport:()=>void}){
 return <div><button disabled={exporting} onClick={onExport} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40">{exporting?`Rendering ${Math.round(progress*100)}%`:"Export video"}</button>
 {exporting&&<div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-cyan-400 transition-all" style={{width:`${progress*100}%`}}/></div>}</div>
}