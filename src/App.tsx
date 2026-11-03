import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileMusic, Film, Play, Sparkles } from "lucide-react";
import { FileDropZone } from "./components/FileDropZone";
import { StyleGallery } from "./components/StyleGallery";
import { PalettePicker } from "./components/PalettePicker";
import { AudioPlayer } from "./components/AudioPlayer";
import { VisualizerCanvas } from "./components/VisualizerCanvas";
import { ExportPanel } from "./components/ExportPanel";
import { AudioEngine } from "./engine/AudioEngine";
import { ExportEngine } from "./engine/ExportEngine";
import { parseMidi } from "./engine/MidiParser";
import { StyleManager } from "./styles/StyleManager";
import { palettes } from "./data/palettes";

export default function App(){
 const audio=useMemo(()=>new AudioEngine(),[]), exporter=useMemo(()=>new ExportEngine(),[]), styles=useMemo(()=>new StyleManager(),[]);
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const [styleId,setStyleId]=useState("vintage-synth"),[paletteId,setPaletteId]=useState("cyber"),[playing,setPlaying]=useState(false),[current,setCurrent]=useState(0),[progress,setProgress]=useState(0),[exporting,setExporting]=useState(false),[midiName,setMidiName]=useState(""),[audioName,setAudioName]=useState("");
 const style=styles.get(styleId)!; const palette=palettes.find(p=>p.id===paletteId)!;
 useEffect(()=>{let r=0;const tick=()=>{setCurrent(audio.currentTime);r=requestAnimationFrame(tick)};tick();return()=>cancelAnimationFrame(r)},[audio]);
 useEffect(()=>()=>audio.destroy(),[audio]);
 const getData=useCallback(()=>audio.getVisualizerData(),[audio]);
 const loadMidi=useCallback(async(f:File)=>{const m=await parseMidi(f);audio.setMidi(m.notes,m.bpm,m.duration);setMidiName(f.name)},[audio]);
 const loadAudio=useCallback(async(f:File)=>{await audio.loadAudio(f);setAudioName(f.name)},[audio]);
 const exportVideo=async()=>{
   const c=canvasRef.current;if(!c||!audio.duration)return;
   setExporting(true);setProgress(0);
   const blob=await exporter.export({canvas:c,audioStream:audio.getStream(),duration:audio.duration,renderFrame:t=>{const ctx=c.getContext("2d");if(ctx)style.render(ctx,audio.getVisualizerData(),t,palette)},onProgress:setProgress});
   const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="loop-visualizer.webm";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setExporting(false);
 };
 return <div className="min-h-screen bg-[#07080c] text-white">
  <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080c]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4">
   <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><Film size={18}/></div><div><div className="font-bold">Loop Visualizer</div><div className="text-[10px] uppercase tracking-[.2em] text-white/30">Music → Motion</div></div></div>
   <div className="hidden items-center gap-5 text-xs text-white/40 sm:flex"><span>9:16</span><span>1080×1920</span><span>60 FPS</span></div>
  </div></header>
  <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-7 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_430px]">
   <section className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-4">
    <div className="relative"><VisualizerCanvas ref={canvasRef} style={style} palette={palette} getData={getData}/><div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] text-white/40 backdrop-blur">SAFE PREVIEW</div></div>
    <div className="w-full max-w-[720px]"><AudioPlayer playing={playing} currentTime={current} duration={audio.duration} onPlay={async()=>{await audio.play();setPlaying(true)}} onPause={()=>{audio.pause();setPlaying(false)}} onSeek={v=>{audio.seek(v);setCurrent(v)}}/></div>
   </section>
   <aside className="space-y-5">
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileMusic size={16}/> Source</div><FileDropZone onMidi={loadMidi} onAudio={loadAudio}/><div className="mt-3 space-y-1 text-xs text-white/50">{midiName&&<div>MIDI · <span className="text-white/80">{midiName}</span></div>}{audioName&&<div>AUDIO · <span className="text-white/80">{audioName}</span></div>}{!midiName&&!audioName&&<div>Drop a MIDI and/or audio loop to begin.</div>}</div></div>
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles size={16}/> Visual style</div><StyleGallery styles={styles.getAll()} selected={styleId} onSelect={setStyleId}/></div>
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 text-sm font-semibold">Palette</div><PalettePicker palettes={palettes} selected={paletteId} onSelect={setPaletteId}/></div>
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold">Export</div><div className="flex items-center gap-1 text-[10px] text-white/30"><Download size={12}/> WEBM / VP9</div></div><ExportPanel exporting={exporting} progress={progress} onExport={exportVideo}/><div className="mt-3 text-[10px] leading-4 text-white/30">The browser records a 1080×1920 canvas at 60 FPS and mixes the available audio stream. MP4/H.264 conversion can be added with ffmpeg.wasm.</div></div>
   </aside>
  </main>
 </div>
}