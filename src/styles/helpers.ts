export function loopProgress(time: number, duration: number) {
  if (!duration || !Number.isFinite(duration)) return 0;
  return ((time % duration) + duration) % duration / duration;
}

export function avgFrequency(data: Uint8Array, start = 0, end = data.length) {
  if (!data.length) return 0;
  let sum = 0;
  const e = Math.min(end, data.length);
  for (let i = start; i < e; i++) sum += data[i];
  return sum / Math.max(1, e - start) / 255;
}

export function activeMidiNotes(data: import("../types/audio").VisualizerData, time: number) {
  return data.midiNotes.filter(n => {
    const t = time % Math.max(data.duration, 0.0001);
    return t >= n.time && t <= n.time + n.duration;
  });
}