class RVis {
  Play: boolean = false;
  timeOut: ReturnType<typeof setTimeout> = 0;
  timeOutTime: number = 25.0;
  Beats: number[] = [];

  constructor() {
  }

  stopDetect() {
    this.Play = false;
  }

  detectTimeEnd(callback: () => void, stopTime: number): void {
    const startTime = new Date().getTime();
    const tempo = 100;
    const beatsPerSecond = 60 / tempo;
    const metronomeBuffer = (beatsPerSecond * 4) * 1000;
    const lastTime = startTime + stopTime + metronomeBuffer;
    this.Play = true;
    const inner = () => {
      const currentTime = new Date().getTime();
      if (lastTime > currentTime && this.Play) {
        requestAnimationFrame(inner);
      } else {
        callback();
      }
    }
    inner();
  }
  
  detect(analyser: AnalyserNode,
         stream: MediaStream,
         aContext: AudioContext,
         canvas: HTMLCanvasElement,
         callback: (beats: number[]) => void,
         stopTime: number,
         threshold: number = -50) {
    this.Play = true;
    const source = aContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferSize = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferSize);

    const startTime = new Date().getTime();
    let lastBeatTime = new Date().getTime();
    let hasHit = false;
    const timeBuffer = 180;

    // these are temp values
    const tempo = 100;
    const beatsPerSecond = 60 / tempo;
    const metronomeBuffer = (beatsPerSecond * 4) * 1000;
    const lastTime = startTime + stopTime + metronomeBuffer;
    //

    const inner = () => {
      if (new Date().getTime() > lastTime) {
        this.stopDetect();
        callback(this.Beats);
        this.Beats = [];
        return;
      }
      analyser.getFloatFrequencyData(dataArray);
      const currentTime = new Date().getTime();
      let inTimeout = false;
      for (let i=0;i<bufferSize / 4;i++) {
        const val = dataArray[i];
        if (hasHit && currentTime > lastBeatTime + timeBuffer) {
          hasHit = false;
        }  

        if (!hasHit && val > threshold) {
          // TODO: Identify the source of this latency ? Seems to be around ~200ms
          // OR my sense of rhythm is terrible <-- could be this
          const mysteryLatency = 200; 
          hasHit = true;
          lastBeatTime = new Date().getTime();
          if (lastBeatTime - startTime - metronomeBuffer < -0.5) {
            inTimeout = true;
            //break;
          } else {
            this.Beats.push(lastBeatTime - startTime - metronomeBuffer - mysteryLatency);
            callback(this.Beats);
            console.log(this.Beats);
          }
        }
      }
      this.render(canvas, dataArray, inTimeout);
      if (this.Play) {
        this.timeOut = setTimeout(() => inner(), this.timeOutTime);
      } else {
        clearTimeout(this.timeOut);
        //callback(this.Beats);
        this.Beats = [];
        this.render(canvas, new Float32Array(0), false);
      }
    }
    inner();
  }

  render(canvas: HTMLCanvasElement, dataArray: Float32Array, inTimeout: boolean) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const bufferSize = dataArray.length;
    if (ctx === null) { console.error("Context is null!"); return; }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = inTimeout ? "red" : "black";
    for (let i=0;i<bufferSize / 4;i++) {
      ctx.fillRect(i * (w * 2.0 / (bufferSize / 4)), h, 1.0 * (w * 2.0 / (bufferSize / 4)),
             (-100 + (-dataArray[i])) * 2);
    }
  }
}

export { RVis }
