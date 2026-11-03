export interface MidiNote {
  name: string;
  midi: number;
  time: number;
  duration: number;
  velocity: number;
}

export interface VisualizerData {
  waveform: Float32Array;
  frequencyData: Uint8Array;
  midiNotes: MidiNote[];
  bpm: number;
  amplitude: number;
  duration: number;
  currentTime: number;
}

export interface Palette {
  id: string;
  name: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
}