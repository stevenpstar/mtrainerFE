import { useEffect, useRef, useState } from "react";
import { RVis } from "./RVisualiser";
import { Sheet } from "./Sheet";
import { ConfigSettings, App as Score } from "../lib/sheet/entry.mjs";
import { GenerateRhythm } from "./rhythmreading/RGenerator";
import { Sinth } from "../lib/sinth/main.mjs";
import { normalTheme } from "../utils/Theme";
import { MenuDropdown } from "@/components/custom/MenuDropdown";
import { PlayControls } from "@/components/custom/PlayControls";
import { RhythmSelect } from "@/components/custom/RhythmSelect";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";

enum InputType {
  MICROPHONE = 0,
  KEYBOARD,
  MOUSE,
  MIDI,
}

function RhythmReading() {

  const [perfectCount, setPerfectCount] = useState<number>(0);
  const [goodCount, setGoodCount] = useState<number>(0);
  const [closeCount, setCloseCount] = useState<number>(0);
  const [missCount, setMissCount] = useState<number>(0);
  const [rhythmValues, setRhythmValues] = useState<number[]>([0.25]);
  // the rhythm test can take + a buffer of 1 beat

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mStream = useRef<MediaStream | null>(null);
  const RDetector = useRef<RVis>(new RVis());
  const detectHit = useRef<boolean>(false);
  const inputType = useRef<InputType>(InputType.KEYBOARD);
  const beatArray = useRef<number[]>([]);
  const startTime = useRef<number>(0);
  const aScore = useRef<Score | null>(null);

  const aContext: AudioContext = new AudioContext({ sampleRate: 8000 });
  const analyser = aContext.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0;

  const setScore = (score: Score) => {
    aScore.current = score;
    beatArray.current = GenerateRhythm(score, rhythmValues);
  }

  const newRhythm = () => {
    if (aScore.current) {
      beatArray.current = GenerateRhythm(aScore.current, rhythmValues);
    }
  }

  const getBeats = (beats: number[]) => {
    // reset counts
    setPerfectCount(0);
    setGoodCount(0);
    setCloseCount(0);
    setMissCount(0);
    beats.forEach((b: number, i: number) => {
      if (i >= beatArray.current.length) {
        return;
      }
      rScore(b, beatArray.current[i]);
    });
  }

  // TODO: Test function for being close
  const rScore = (time: number, desiredTime: number): void => {
    const perfect = 50;
    const good = 100;
    const closeO = 150;
    const dist = Math.abs(time - desiredTime);

    if (dist <= perfect) {
      setPerfectCount(perfectCount => perfectCount + 1);
    } else if (dist <= good) {
      setGoodCount(goodCount => goodCount + 1);
    } else if (dist <= closeO) {
      setCloseCount(closeCount => closeCount + 1);
    } else {
      setMissCount(missCount => missCount + 1);
    }
  }

  const rSettings: ConfigSettings = {
    CameraSettings: {
      DragEnabled: false,
      ZoomEnabled: false,
      Zoom: 1,
      StartingPosition: { x: 0, y: 100 },
      CenterMeasures: false,
      CenterPage: true,
    },
    FormatSettings: {
      MeasureFormatSettings: {
        Selectable: false,
        MaxWidth: 400,
      }
    },
    NoteSettings: {
      InputValue: 0.5,
    },
    PageSettings: {
      RenderPage: true,
      RenderBackground: false,
      ContainerWidth: false,
      UsePages: true,
      AutoSize: true,
    },
    DefaultStaffType: "rhythm",
    Theme: normalTheme,
  }

  const getAudioDevice = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        mStream.current = stream;
        aContext.createMediaStreamSource(mStream.current);
        analyser.connect(aContext.destination);
        mediaRecorder.current = new MediaRecorder(mStream.current);
      })
      .catch((err) => console.error(err));
  }

  if (!mStream.current) {
    getAudioDevice();
  }

  const startRecording = () => {
    startTime.current = new Date().getTime();
    if (inputType.current === InputType.MICROPHONE) {
      if (!canvasRef.current) { return; }
      if (!mediaRecorder.current) { console.log("no media recorder"); return; }
      // mediaRecorder.current.start();
      const context = canvasRef.current.getContext("2d");
      //    const bContext = bCanvasRef.current.getContext("2d");
      if (!context) { return; }
      if (!mStream.current) { return; }
      detectHit.current = true;
      if (beatArray.current.length === 0) { return; }
      RDetector.current.detect(analyser, mStream.current, aContext, canvasRef.current, getBeats, beatArray.current[beatArray.current.length - 1] + 600);
      Sinth.playMetronome(aContext, 4, 100);
    } else if (inputType.current === InputType.KEYBOARD) {
      detectHit.current = true;
      RDetector.current.Beats = [];
      Sinth.playMetronome(aContext, 4, 100);
      RDetector.current.detectTimeEnd(stopDetecting, beatArray.current[beatArray.current.length - 1] + 600);
    } else if (inputType.current === InputType.MOUSE) {
      detectHit.current = true;
      Sinth.playMetronome(aContext, 4, 100);
      RDetector.current.Beats = [];
      RDetector.current.detectTimeEnd(stopDetecting, beatArray.current[beatArray.current.length - 1] + 600);
    }
  }

  const stopDetecting = () => {
    detectHit.current = false;
  }

  const stopRecording = () => {
    if (!mediaRecorder.current) { return; }
    //mediaRecorder.current.stop();
    RDetector.current.stopDetect();
    detectHit.current = false;
  }

  const handleKeyDown = () => {
    if (detectHit.current && inputType.current === InputType.KEYBOARD) {
      // TODO: 2400 is metronome buffer, needs to differe depending on tempo
      RDetector.current.Beats.push(new Date().getTime() - startTime.current - 2400);
      getBeats(RDetector.current.Beats);
    }
  }

  const handleMouseDown = () => {
    if (detectHit.current && inputType.current === InputType.MOUSE) {
      // TODO: 2400 is metronome buffer, needs to differe depending on tempo
      RDetector.current.Beats.push(new Date().getTime() - startTime.current - 2400);
      getBeats(RDetector.current.Beats);
    }
  }
  // Setting up keyboard event listeners, might
  // be a better way to do this
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  return (
    <div className='flex flex-col justify-start h-full'>
      <div className='flex flex-row justify-between min-h-[50px] bg-zinc-950 font-light text-zinc-100'>
        <div className='flex flex-row justify-start gap-2'>
          <MenuDropdown />
          <PlayControls
            play={() => startRecording()}
            stop={() => stopRecording()} />
          <Separator orientation='vertical' />
          <Button
            onClick={() => newRhythm()}
          >New Rhythm +</Button>
        </div>
      </div>
      <div className='flex flex-row justify-between min-h-[50px] bg-zinc-900 font-light text-zinc-300 shadow-md z-50'>
        <div className='flex flex-col justify-center h-full'>
          <RhythmSelect
            setToolRhythmValues={setRhythmValues} />
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className='grow testbg'>
          <Sheet w='100%' h='600px' f='' setParentScore={setScore} callback={() => { }} config={rSettings} />
        </div>
      </div>
      <div className='min-h-[50%] grow bg-zinc-950'>
        <div className='flex flex-row justify-center mt-4 gap-2'>
          <div className='text-[#a2d2ff] font-medium'>
            PERFECT: {perfectCount}
          </div>
          <div className='text-[#caffbf] font-medium'>
            GOOD: {goodCount}
          </div>
          <div className='text-[#ffd6a5] font-medium'>
            CLOSE: {closeCount}
          </div>
          <div className='text-[#f08080] font-medium'>
            MISS: {missCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export { RhythmReading }
