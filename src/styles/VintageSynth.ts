import type { Palette, VisualizerData } from "../types/audio";
import type { VisualizerStyle } from "./types";
import { activeMidiNotes, loopProgress } from "./helpers";

export class VintageSynth implements VisualizerStyle {
  id = "vintage-synth";
  name = "Vintage Synth";
  description = "Retro synth panel with glowing note lanes.";

  render(ctx: CanvasRenderingContext2D, data: VisualizerData, time: number, p: Palette) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    ctx.fillStyle = p.background; ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = p.muted; ctx.lineWidth = 2;
    for (let y = 120; y < h; y += 120) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const center = h * 0.52;
    const pulse = data.amplitude * 180;
    ctx.shadowBlur = 24; ctx.shadowColor = p.primary;

    for (const note of data.midiNotes) {
      const x = (((note.time - (time % Math.max(data.duration, .001))) / Math.max(data.duration, .001)) * w + w) % w;
      const y = center - (note.midi - 60) * 14;
      const active = activeMidiNotes(data, time).includes(note);
      ctx.globalAlpha = active ? 1 : .22;
      ctx.fillStyle = active ? p.accent : p.primary;
      ctx.fillRect(x, y, Math.max(10, note.duration * 100), 8 + (active ? pulse * .03 : 0));
    }

    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.strokeStyle = p.accent; ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i < data.waveform.length; i++) {
      const x = i / data.waveform.length * w;
      const y = center + data.waveform[i] * (250 + pulse);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = p.secondary;
    ctx.font = "bold 28px ui-monospace, monospace";
    ctx.fillText(`BPM ${Math.round(data.bpm)}`, 54, 70);
    ctx.fillText(`${Math.round(loopProgress(time, data.duration) * 100)}% LOOP`, 54, 106);
  }
}