import type { Palette, VisualizerData } from "../types/audio";
import type { VisualizerStyle } from "./types";
import { avgFrequency } from "./helpers";

export class NeonGrid implements VisualizerStyle {
  id = "neon-grid"; name = "Neon Grid"; description = "Retro-futuristic perspective grid.";
  render(ctx: CanvasRenderingContext2D, data: VisualizerData, time: number, p: Palette) {
    const w=ctx.canvas.width,h=ctx.canvas.height,horizon=h*.48;
    ctx.fillStyle=p.background;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=p.primary;ctx.lineWidth=3;ctx.shadowBlur=16;ctx.shadowColor=p.primary;
    for(let i=0;i<18;i++){const t=(i/18+time*.12)%1,y=horizon+t*t*(h-horizon);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let i=-10;i<=10;i++){ctx.beginPath();ctx.moveTo(w/2,horizon);ctx.lineTo(w/2+i*w*.12,h);ctx.stroke();}
    const e=avgFrequency(data.frequencyData)+data.amplitude;
    ctx.strokeStyle=p.accent;ctx.lineWidth=10;ctx.beginPath();ctx.arc(w/2,horizon,100+e*500,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
  }
}