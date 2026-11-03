import type { Palette, VisualizerData } from "../types/audio";

export interface VisualizerStyle {
  id: string;
  name: string;
  description: string;
  render(
    ctx: CanvasRenderingContext2D,
    data: VisualizerData,
    time: number,
    palette: Palette
  ): void;
}