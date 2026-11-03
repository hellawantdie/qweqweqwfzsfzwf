import type { VisualizerStyle } from "./types";
import { avgFrequency, loopProgress } from "./helpers";

function drawBase(ctx: CanvasRenderingContext2D, data: any, time: number, p: any, mode: string) {
  const w=ctx.canvas.width,h=ctx.canvas.height;
  ctx.fillStyle=p.background;ctx.fillRect(0,0,w,h);
  const e=avgFrequency(data.frequencyData)+data.amplitude;
  const prog=loopProgress(time,data.duration);
  if(mode==="spectrum"){
    const bars=64;
    for(let i=0;i<bars;i++){const v=(data.frequencyData[Math.floor(i/data.frequencyData.length*data.frequencyData.length)]||0)/255;const bh=v*h*.55;ctx.fillStyle=i%3===0?p.accent:p.primary;ctx.fillRect(i*w/bars,h-bh,w/bars-4,bh);}
  } else if(mode==="vinyl"){
    ctx.strokeStyle=p.primary;ctx.shadowBlur=20;ctx.shadowColor=p.primary;
    for(let r=80;r<800;r+=55){ctx.lineWidth=3;ctx.beginPath();ctx.arc(w/2,h/2,r+Math.sin(prog*Math.PI*2+r)*e*25,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle=p.background;ctx.beginPath();ctx.arc(w/2,h/2,170+e*100,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  } else if(mode==="glitch"){
    for(let i=0;i<80;i++){const y=Math.random()*h;const x=Math.random()*w;ctx.globalAlpha=.15+e;ctx.fillStyle=i%2?p.primary:p.accent;ctx.fillRect(x,y,20+Math.random()*300,2+Math.random()*12);}
    ctx.globalAlpha=1;
  } else if(mode==="liquid"){
    ctx.beginPath();ctx.moveTo(0,h/2);
    for(let x=0;x<=w;x+=12){const y=h/2+Math.sin(x*.01+prog*Math.PI*2)*120+Math.sin(x*.023-time)*e*500;ctx.lineTo(x,y);}
    ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=p.primary;ctx.globalAlpha=.45;ctx.fill();ctx.globalAlpha=1;
  } else {
    ctx.strokeStyle=p.primary;ctx.lineWidth=6;ctx.beginPath();
    for(let i=0;i<data.waveform.length;i++){const x=i/data.waveform.length*w,y=h/2+data.waveform[i]*(300+e*350);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
  }
}

const defs=[
  ["wood-hardware","Wood Hardware","Warm hardware-inspired panel","base"],
  ["spectrum-bars","Spectrum Bars","Punchy frequency columns","spectrum"],
  ["vinyl","Vinyl","Spinning record geometry","vinyl"],
  ["tape-machine","Tape Machine","Cassette deck energy","base"],
  ["crt-terminal","CRT Terminal","Retro green terminal","glitch"],
  ["liquid","Liquid","Fluid audio surface","liquid"],
  ["matrix","Matrix","Digital falling energy","spectrum"],
  ["minimal-pulse","Minimal Pulse","Clean centered pulse","base"],
  ["retro-arcade","Retro Arcade","Arcade-inspired energy","glitch"],
  ["solar-system","Solar System","Orbiting audio particles","vinyl"],
  ["glitch","Glitch","Broken digital signal","glitch"],
  ["kaleidoscope","Kaleidoscope","Mirrored audio geometry","vinyl"],
  ["blueprint","Blueprint","Engineering drawing","base"],
  ["led-wall","LED Wall","Dense LED matrix","spectrum"],
  ["wave-tunnel","Wave Tunnel","Depth tunnel waveform","vinyl"],
  ["digital-rain","Digital Rain","Reactive digital rain","spectrum"]
] as const;

export class GenericStyle implements VisualizerStyle {
  constructor(public id:string,public name:string,public description:string,private mode:string){}
  render(ctx:CanvasRenderingContext2D,data:any,time:number,p:any){drawBase(ctx,data,time,p,this.mode);}
}
export const genericStyles=defs.map(d=>new GenericStyle(d[0],d[1],d[2],d[3]));
