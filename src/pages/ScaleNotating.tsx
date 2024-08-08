import { ConfigSettings, Message, MessageType, Note, ReturnMidiNumber, App as Score } from '../lib/sheet/entry.mjs';
import { useEffect, useRef, useState } from "react";
import { Sheet } from "./Sheet";
import { LoadEmptySheet } from "./rhythmreading/RGenerator";
import { normalTheme } from "../utils/Theme";
import { Sinth, Note as SinthNote } from "../lib/sinth/main.mjs";
import { CheckScaleAnswer, GenerateScale, GenerateSinthNotes } from "../generators/ScaleGenerator";
import { AppTopBar } from "@/components/custom/AppTopBar";
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-ui/react-icons';

function ScaleNotate() {

  const aSample = useRef<AudioBuffer | null>(null);
  const aContext = useRef<AudioContext>(new AudioContext());
  const aScore = useRef<Score | null>(null);


  const [scaleString, setScaleString] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);

  const setScore = (score: Score): void => {
    aScore.current = score;
    LoadEmptySheet(aScore.current, 4);
    setScaleString(GenerateScale(aScore.current));
    setScoreLoaded(true);
  }

  const scaleSettings: ConfigSettings = {
    CameraSettings: {
      DragEnabled: false,
      ZoomEnabled: false,
      Zoom: 1,
      StartingPosition: { x: 0, y: 50 },
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
      InputValue: 0.25,
    },
    PageSettings: {
      RenderPage: true,
      RenderBackground: false,
      ContainerWidth: false,
      UsePages: true,
      AutoSize: true,
    },
    DefaultStaffType: "single",
    Theme: normalTheme,
  }

  const callback = (msg: Message) => {
    switch (msg.messageData.MessageType) {
      case MessageType.Selection:
        playSelectedNote(msg.messageData.Message.obj as Note);
        break;
      case MessageType.AddNote:
        onAddNote(msg.messageData.Message.obj as Note);
        break;
      default:
    }
  }

  const onAddNote = (note: Note) => {
    playSelectedNote(note);
  }

  const playSelectedNote = (note: Note) => {
    const midi = ReturnMidiNumber("treble",
      note.Line, note.Accidental, 0);
    const sNote: SinthNote = {
      Beat: 1,
      Duration: 2,
      MidiNote: midi,
    }
    if (aSample.current) {
      Sinth.playFull(aContext.current, aSample.current, 120, [sNote], () => { });
    }
  }

  const GenerateNewScale = (): void => {
    if (aScore.current) {
      setScaleString(GenerateScale(aScore.current));
      setSubmitted(_ => false);
    }
  }

  useEffect(() => {
    fetch("/A4vH.flac")
      .then(resp => resp.arrayBuffer())
      .then(aBuffer => aContext.current.decodeAudioData(aBuffer))
      .then(s => aSample.current = s);
  }, [])

  const PlayRhythm = () => {
    const sNotes = GenerateSinthNotes(scaleString);
    if (sNotes.length > 0 && aSample.current) {
      Sinth.initplay(sNotes);
      Sinth.playFull(aContext.current, aSample.current, 100, sNotes, () => { });
    }
  }

  const CheckAnswer = (): boolean => {
    if (aScore.current) {
      const ans = CheckScaleAnswer(scaleString, aScore.current);
      setSubmitted(_ => true);
      return ans;
    }
    return false;
  }

  return (
    <div className='flex flex-col justify-start h-full'>
      {scoreLoaded &&
        <AppTopBar
          score={aScore.current}
          playFunc={() => PlayRhythm()}
        />
      }
      <div className='flex flex-row justify-center'>
        <div className='grow testbg'>
          <Sheet
            w='100%'
            h='500px' f=''
            setParentScore={setScore}
            callback={callback}
            config={scaleSettings} />
        </div>
      </div>
      <div className='min-h-[50%] grow bg-zinc-950'>
        <div className='flex flex-row justify-center'>
          <Button
            className='-top-[3.5rem] relative bg-zinc-900 text-[#caffbf]'
            onClick={() => GenerateNewScale()}>Generate New Scale +</Button>
        </div>
        <div className='flex flex-row justify-center min-w-[500px] text-zinc-200 text-lg -top-[1.5rem] relative'>
          <ChevronRightIcon className='text-[#a2d2ff] h-5 w-5 mt-1' />
          {scaleString}
        </div>
        <div className='flex flex-row justify-center min-w-[600px]'>
          <div className='flex flex-row justify-end w-[600px]'>
            {!submitted &&
              <Button className='ml-10 bg-zinc-900 text-[#caffbf]'
                onClick={() => CheckAnswer()}
              >Submit</Button>
            }
            {submitted &&
              <Button className='ml-10 bg-zinc-900 text-[#caffbf]'
                onClick={() => GenerateNewScale()}
              >Next</Button>
            }
          </div>
        </div>

      </div>

    </div>
  )
}

export { ScaleNotate }
