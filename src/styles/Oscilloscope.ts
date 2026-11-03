import type { Palette, VisualizerData } from "../types/audio";
import type { VisualizerStyle } from "./types";
import { loopProgress } from "./helpers";

export class Oscilloscope implements VisualizerStyle {
  id="oscilloscope"; name="Oscilloscope"; description="Classic glowing audio trace.";
  render(ctx: CanvasRenderingContext2D, data: VisualizerData, time: number, p: Palette){
    const w=ctx.canvas.width,h=ctx.canvas.height,c=h/2;
    ctx.fillStyle=p.background;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=p.muted;ctx.lineWidth=2;
    for(let y=c-600;y<=c+600;y+=100){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.strokeStyle=p.primary;ctx.lineWidth=8;ctx.shadowBlur=28;ctx.shadowColor=p.primary;ctx.beginPath();
    const offset=Math.floor(loopProgress(time,data.duration)*data.waveform.length);
    for(let i=0;i<data.waveform.length;i++){const idx=(i+offset)%data.waveform.length,x=i/data.waveform.length*w,y=c+data.waveform[idx]*520*(1+data.amplitude*2);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=p.accent;ctx.font="bold 30px ui-monospace, monospace";ctx.fillText("OSCILLOSCOPE",48,70);
  }
}