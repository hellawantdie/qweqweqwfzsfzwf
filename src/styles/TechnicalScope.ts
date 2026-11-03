import type { Palette, VisualizerData } from "../types/audio";
import type { VisualizerStyle } from "./types";
import { avgFrequency } from "./helpers";

export class TechnicalScope implements VisualizerStyle {
  id = "technical-scope";
  name = "Technical Scope";
  description = "Scientific oscilloscope with scanline.";
  render(ctx: CanvasRenderingContext2D, data: VisualizerData, time: number, p: Palette) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.fillStyle = p.background; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = p.muted; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for (let y = 0; y < h; y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

    const energy = avgFrequency(data.frequencyData) + data.amplitude;
    ctx.strokeStyle = p.primary; ctx.lineWidth = 5; ctx.shadowBlur = 18; ctx.shadowColor = p.primary;
    ctx.beginPath();
    for (let i = 0; i < data.waveform.length; i++) {
      const x = i / data.waveform.length * w;
      const y = h/2 + data.waveform[i] * (350 + energy * 250);
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke(); ctx.shadowBlur = 0;

    const scan = ((time % 3) / 3) * w;
    ctx.fillStyle = p.accent; ctx.globalAlpha = .8;
    ctx.fillRect(scan, 0, 4, h); ctx.globalAlpha = 1;

    ctx.fillStyle = p.primary; ctx.font = "22px ui-monospace, monospace";
    ctx.fillText("SIGNAL / LIVE", 48, 64);
    ctx.fillText(`AMP ${data.amplitude.toFixed(3)}`, 48, 94);
  }
}