import { Midi } from "@tonejs/midi";
import type { MidiNote } from "../types/audio";

export async function parseMidi(file: File) {
  const midi = new Midi(await file.arrayBuffer());
  const notes: MidiNote[] = [];
  for (const track of midi.tracks) {
    for (const note of track.notes) {
      notes.push({ name: note.name, midi: note.midi, time: note.time, duration: note.duration, velocity: note.velocity });
    }
  }
  return {
    notes,
    duration: midi.duration || (notes.length ? Math.max(...notes.map(n => n.time+n.duration)) : 0),
    bpm: midi.header.tempos[0]?.bpm || 120,
  };
}