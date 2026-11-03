import type { Palette, VisualizerData } from "../types/audio";
import type { VisualizerStyle } from "./types";
import { avgFrequency } from "./helpers";

type Particle={x:number;y:number;speed:number;size:number;phase:number;seed:number};

export class Particles implements VisualizerStyle {
  id="particles";name="Particles";description="Audio-reactive particle field.";
  private particles:Particle[]=[];
  private initialized=false;
  private init(w:number,h:number){this.particles=Array.from({length:260},()=>({x:Math.random()*w,y:Math.random()*h,speed:20+Math.random()*100,size:2+Math.random()*7,phase:Math.random()*Math.PI*2,seed:Math.random()}));this.initialized=true;}
  render(ctx: CanvasRenderingContext2D, data: VisualizerData, time: number, p: Palette){
    const w=ctx.canvas.width,h=ctx.canvas.height;
    if(!this.initialized)this.init(w,h);
    ctx.fillStyle=p.background;ctx.fillRect(0,0,w,h);
    const e=avgFrequency(data.frequencyData)+data.amplitude;
    for(const q of this.particles){
      const x=(q.x+time*q.speed)%w;
      const y=(q.y+Math.sin(time*2+q.phase)*e*500+q.seed*30)%h;
      const s=q.size+e*18;
      ctx.globalAlpha=.25+Math.min(.75,e);
      ctx.fillStyle=q.seed>.5?p.primary:p.secondary;
      ctx.beginPath();ctx.arc(x,y,s,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    ctx.fillStyle=p.accent;ctx.font="bold 32px sans-serif";ctx.fillText("PARTICLE FIELD",48,72);
  }
}