export interface ExportOptions {
  canvas: HTMLCanvasElement;
  audioStream: MediaStream;
  duration: number;
  renderFrame: (time:number)=>void;
  onProgress?: (progress:number)=>void;
}

export class ExportEngine {
  async export({canvas,audioStream,duration,renderFrame,onProgress}:ExportOptions){
    const videoStream=canvas.captureStream(60);
    const combined=new MediaStream([
      ...videoStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus" : "video/webm";
    const recorder=new MediaRecorder(combined,{mimeType:mime,videoBitsPerSecond:12_000_000});
    const chunks:Blob[]=[];
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    const stopped=new Promise<void>(resolve=>recorder.onstop=()=>resolve());
    recorder.start(250);
    const fps=60, total=Math.max(1,Math.ceil(duration*fps));
    const started=performance.now();
    for(let frame=0;frame<total;frame++){
      renderFrame(frame/fps);
      const target=started+frame/fps*1000;
      const delay=target-performance.now();
      if(delay>0) await new Promise(r=>setTimeout(r,delay));
      onProgress?.((frame+1)/total);
    }
    recorder.stop(); await stopped;
    combined.getTracks().forEach(t=>t.stop());
    return new Blob(chunks,{type:mime});
  }
}