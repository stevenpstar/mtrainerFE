import { ToastId, useToast } from "@chakra-ui/react";
import { ConfigSettings, App as Score } from '../lib/sheet/entry.mjs';
import { useEffect, useRef, useState } from "react";
import { Sheet } from "./Sheet";
import { CompareTranscription, GenerateHiddenRhythm } from "./rhythmreading/RGenerator";
import { normalTheme } from "../utils/Theme";
import { Sinth, Note as SinthNote} from "../lib/sinth/main.mjs";
import { AppTopBar } from "@/components/custom/AppTopBar";
import { Button } from "@/components/ui/button";

function RhythmTranscription() {

  const aScore = useRef<Score | null>(null);
  const aSample = useRef<AudioBuffer | null>(null);
  const aContext = useRef<AudioContext>(new AudioContext());
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const [notes, setNotes] = useState<SinthNote[]>([]);
  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);

  const GenerateRhythm = (score: Score) => {
    setNotes(GenerateHiddenRhythm(score));
  }

  const setScore = (score: Score) => {
    aScore.current = score;
    setScoreLoaded(true);
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

  useEffect(() => {
    fetch("/A4vH.flac")
    .then (resp => resp.arrayBuffer())
    .then (aBuffer => aContext.current.decodeAudioData(aBuffer))
    .then (s => aSample.current = s);
  }, [])

  const PlayRhythm = () => {
    if (notes.length > 0 && aSample.current) {
      Sinth.playMetronome(aContext.current, 4, 80);
      Sinth.playFull(aContext.current, aSample.current, 80, notes, () => {});
    }
  }

  const CheckAnswer = () => {
    if (aScore.current) {
      const ans = CompareTranscription(aScore.current, notes);
      toastIdRef.current = toast({
        title: ans ? 'Correct!' : 'Mistake.',
        description: ans ? 'You got it right!' : 'Incorrect',
        status: ans ? 'success' : 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <div className='flex flex-col justify-start h-full'>
    { scoreLoaded &&
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
          callback={() => {}}
          config={rSettings} />
      </div>
    </div>

    <div className='min-h-[50%] grow bg-zinc-950'>
      <div className='flex flex-row justify-center'>
        <Button
          onClick={() => {
            if (aScore.current)
            GenerateRhythm(aScore.current);
          }}
        >New Rhythm</Button>

        <Button
          onClick={() => CheckAnswer()}
        >Submit</Button>

      </div>
    </div>

    </div>

  )
}

export { RhythmTranscription }
