import type { VisualizerStyle } from "./types";
import { VintageSynth } from "./VintageSynth";
import { TechnicalScope } from "./TechnicalScope";
import { NeonGrid } from "./NeonGrid";
import { Oscilloscope } from "./Oscilloscope";
import { Particles } from "./Particles";
import { genericStyles } from "./GenericStyles";

export class StyleManager {
  private styles = new Map<string, VisualizerStyle>();
  constructor() {
    [
      new VintageSynth(),
      new TechnicalScope(),
      new NeonGrid(),
      new Oscilloscope(),
      new Particles(),
      ...genericStyles,
    ].forEach(s => this.styles.set(s.id, s));
  }
  get(id:string){ return this.styles.get(id); }
  getAll(){ return [...this.styles.values()]; }
}