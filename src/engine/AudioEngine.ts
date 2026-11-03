import * as Tone from "tone";
import type { MidiNote, VisualizerData } from "../types/audio";

export class AudioEngine {
  private context: AudioContext;
  private analyser: AnalyserNode;
  private destination: MediaStreamAudioDestinationNode;
  private audioElement: HTMLAudioElement | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private midiNotes: MidiNote[] = [];
  private bpm = 120;
  private midiStarted = false;
  private synth: Tone.PolySynth | null = null;
  private midiStartWall = 0;
  private midiOffset = 0;
  private _duration = 0;

  constructor() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = .72;
    this.destination = this.context.createMediaStreamDestination();
    this.analyser.connect(this.context.destination);
    this.analyser.connect(this.destination);
  }

  async resume() {
    if (this.context.state === "suspended") await this.context.resume();
    await Tone.start();
  }

  async loadAudio(file: File) {
    await this.resume();
    this.audioElement?.pause();
    this.audioSource?.disconnect();
    const buffer = await file.arrayBuffer();
    this.audioBuffer = await this.context.decodeAudioData(buffer.slice(0));
    this._duration = this.audioBuffer.duration;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.loop = true;
    const source = this.context.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.audioElement = audio;
    this.audioSource = source;
  }

  setMidi(notes: MidiNote[], bpm: number, duration:number) {
    this.midiNotes = notes; this.bpm = bpm; this._duration = duration;
  }

  async play() {
    await this.resume();
    if (this.audioElement) { await this.audioElement.play(); return; }
    if (!this.midiNotes.length || this.midiStarted) return;
    this.midiStarted = true;
    this.midiStartWall = performance.now()/1000;
    if (!this.synth) this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const start = performance.now()/1000;
    for (const note of this.midiNotes) {
      window.setTimeout(() => {
        if (!this.midiStarted) return;
        this.synth?.triggerAttackRelease(note.name, note.duration, undefined, note.velocity);
      }, Math.max(0,(note.time-this.midiOffset)*1000));
    }
    void start;
  }

  pause() {
    if (this.audioElement) this.audioElement.pause();
    this.midiStarted = false;
    this.synth?.releaseAll();
  }

  seek(time:number) {
    const t = this._duration ? ((time % this._duration)+this._duration)%this._duration : 0;
    if (this.audioElement) this.audioElement.currentTime=t;
    this.midiOffset=t;
    this.midiStartWall=performance.now()/1000;
    this.midiStarted=false;
  }

  get currentTime() {
    if (this.audioElement) return this.audioElement.currentTime;
    if (this.midiStarted && this._duration) return ((performance.now()/1000-this.midiStartWall+this.midiOffset)%this._duration+this._duration)%this._duration;
    return this.midiOffset;
  }
  get duration(){ return this._duration; }
  getStream(){ return this.destination.stream; }

  getVisualizerData():VisualizerData {
    const waveform=new Float32Array(this.analyser.fftSize);
    const frequencyData=new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatTimeDomainData(waveform);
    this.analyser.getByteFrequencyData(frequencyData);
    let sum=0; for(const v of waveform) sum+=v*v;
    return { waveform, frequencyData, midiNotes:this.midiNotes, bpm:this.bpm, amplitude:Math.sqrt(sum/waveform.length), duration:this._duration, currentTime:this.currentTime };
  }

  destroy(){ this.audioElement?.pause(); this.audioSource?.disconnect(); this.synth?.dispose(); void this.context.close(); }
}