import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Palette, VisualizerData } from "../types/audio";
import type { VisualizerStyle } from "../styles/types";

export const VisualizerCanvas=forwardRef<HTMLCanvasElement,{style:VisualizerStyle;palette:Palette;getData:()=>VisualizerData}>(
 ({style,palette,getData},ref)=>{
  const canvas=useRef<HTMLCanvasElement>(null); useImperativeHandle(ref,()=>canvas.current!);
  useEffect(()=>{let raf=0;const loop=()=>{const c=canvas.current,ctx=c?.getContext("2d");if(c&&ctx){const d=getData();style.render(ctx,d,d.currentTime,palette)}raf=requestAnimationFrame(loop)};loop();return()=>cancelAnimationFrame(raf)},[style,palette,getData]);
  return <canvas ref={canvas} width={1080} height={1920} className="h-[min(72vh,820px)] w-auto max-w-full rounded-2xl border border-white/10 bg-black shadow-2xl"/>
 }
);