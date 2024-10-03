/* Core Chord Trainer Component */
import { useEffect, useRef, useState } from 'react'
import { Message, MessageType, Note, App as Score } from '../../lib/sheet/entry.mjs'
import { Sheet } from '../Sheet';
import { CTSettings } from './CTSettings';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import { MusicNotes } from '@/components/custom/MusicNotes';
import { MenuDropdown } from '@/components/custom/MenuDropdown';
import { InputSelectGroup } from '@/components/custom/InputSelectGroup';
import { PlayControls } from '@/components/custom/PlayControls';
import { CTEmptySheet, GenerateChord } from './ChordGenerator';
import { Note as SinthNote, Sinth } from '../../lib/sinth/main.mjs';
import { PlaySelectedNote } from '@/utils/OnSelected';
import { MultiInput } from '@/components/custom/MultiInput';
import { useToast } from '@/components/ui/use-toast';
import { ChordSettings, ChrdSettings } from './Settings';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function ChordTrainer() {

  const { toast } = useToast();

  const aContext = useRef<AudioContext>(new AudioContext());
  const aSample = useRef<AudioBuffer | null>(null);
  const aScore = useRef<Score | null>(null);
  const aVolume = useRef<number>(50);

  const correct = new Audio("/correct.mp3");
  const incorrect = new Audio("/incorrect.mp3");

  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);
  const [notes, setNotes] = useState<SinthNote[]>([]);
  const [answerStrings, setAnswerStrings] = useState<string[]>([]);
  const [bits, setBits] = useState<string[]>([]);
  // For multi inputs
  const [answered, setAnswered] = useState<boolean>(false);
  const [chordCount, setChordCount] = useState<number>(1);

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const settings = useRef<ChrdSettings>({
    Major: true,
    Minor: true,
    Maj7: true,
    Min7: true,
    Notate: true,
    Root: true,
    Inv1: true,
    Inv2: true,
  });

  const UpdateSettings = (set: ChrdSettings) => {
    settings.current = set;
    setShowSettings(false);
  }

  const BitString = (): string => {
    let str = '';
    bits.forEach(b => {
      str += b;
      str += ' ';
    })
    return str;
  }

  const GenChord = () => {
    setChordCount(1);
    const msrCount = Math.ceil(chordCount / 2);
    CTEmptySheet(aScore.current, msrCount);
    const sinthNotes: SinthNote[] = [];
    // TODO: Expand chords to have progressions later. Some work here.
    const as: string[] = [];
    for (let i = 0; i < chordCount; i++) {
      // we are having max 4 chords, 2 measures. TODO: Maybe expand
      const msr = i > 1 ? 1 : 0;
      const beat = i % 2 == 0 ? 1 : 3;
      const cData = GenerateChord(aScore.current, msr, beat);
      sinthNotes.push(...cData.SNotes);
      as.push(cData.ChordStr);
    }
    setAnswerStrings(_ => [...as]);
    setNotes(_ => sinthNotes);
    if (aSample.current) {
      Sinth.playFull(aContext.current, aSample.current, 120, aVolume.current, sinthNotes, () => { });
    }
  }

  const CheckAnswer = (): void => {
    if (answered) {
      NextChord();
      return;
    }
    let answerCorrect = true;
    answerStrings.forEach((a: string) => {
      const ans = a.replace(/\s/g, "").toLowerCase();
      console.log("ans: ", ans);
      const guess = BitString().replace(/\s/g, "").toLowerCase();
      console.log("guess: ", guess);
      if (guess !== ans) {
        answerCorrect = false;
      }
    });
    if (answerCorrect) {
      setAnswered(true);
      correct.volume = 0.5;
      correct.play();
      toast({
        variant: "correct",
        title: "Correct!",
        description: "You got it right",
      })
    } else {
      incorrect.volume = 0.5;
      incorrect.play();
      toast({
        variant: "incorrect",
        title: "Incorrect!",
        description: "You got it wrong",
      })
    }
  }

  const NextChord = (): void => {
    GenChord();
    setAnswered(false);
    const emptyBits: string[] = [];
    setBits(_ => emptyBits);
  }

  const callback = (msg: Message) => {
    switch (msg.messageData.MessageType) {
      case MessageType.Selection:
        if (!aSample.current || !aContext.current) {
          return;
        }
        PlaySelectedNote(msg.messageData.Message.obj as Note, aVolume.current, aSample.current, aContext.current);
        break;
      case MessageType.AddNote:
        break;
      default:
    }
  }

  const setScore = (score: Score) => {
    aScore.current = score;
    setScoreLoaded(true);
  }

  const playChord = () => {
    if (notes.length > 1 && aSample.current) {
      Sinth.playFull(aContext.current, aSample.current, 120, aVolume.current, notes, () => { });
    }
  }

  useEffect(() => {
    if (!aSample.current) {
      fetch("/a4.flac")
        .then(resp => resp.arrayBuffer())
        .then(aBuffer => aContext.current.decodeAudioData(aBuffer))
        .then(s => aSample.current = s);
    }
  }, [])

  return (
    <div className='flex flex-col justify-start h-full'>
      <div className='flex flex-row justify-between h-[50px] bg-zinc-950 font-light text-zinc-100'>
        <div className='flex flex-row justify-start gap-2 grow'>
          <MenuDropdown />
          {scoreLoaded &&
            <InputSelectGroup score={aScore.current} />
          }
          <Separator orientation='vertical' className='bg-zinc-800' />
          <PlayControls
            play={() => playChord()}
            stop={() => { }}
            setShowSettings={() => setShowSettings(!showSettings)}
            setParentVolume={(v: number) => aVolume.current = v} />
        </div>
        <div className='flex flex-row justify-end gap-2'>
        </div>
      </div>
      <div className='flex flex-row justify-between h-[50px] bg-zinc-900 font-light text-zinc-300 shadow-md z-50'>
        <div className='flex flex-col justify-center h-full'>
          <div className='flex flex-row justify-start gap-2'>
            <MusicNotes
              c='h-9 flex flex-row items-center justify-center gap-2'
              score={aScore.current}
              defaultVal='0.5'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-center'>
        <div className='grow testbg'>
          <Sheet
            w='100%'
            h='500px' f=''
            setParentScore={setScore}
            callback={callback}
            config={CTSettings} />
        </div>
      </div>
      <div className='min-h-[50%] grow bg-zinc-950'>
        <div className='mt-4 h-10 w-full'>
          <div className='flex flex-row justify-center'>
            <Button
              className='-top-[3.5rem] relative bg-zinc-900 text-[#caffbf]'
              onClick={() => GenChord()}>New Chord +</Button>
          </div>
          <div className='flex flex-row justify-center min-w-[500px] text-zinc-200 text-lg -top-[2.5rem] relative'>
            <ChevronRightIcon className='text-[#a2d2ff] h-5 w-5 mt-1' />
            {
              BitString()
            }
          </div>
        </div>
        <div className='flex flex-row justify-center'>
          <MultiInput
            bits={bits}
            setBits={setBits}
            submit={CheckAnswer}
          />
        </div>
        <div className='flex flex-row justify-center min-w-[600px]'>
          <div className='flex flex-row justify-end w-[600px]'>
            {!answered &&
              <Button className='ml-10 bg-zinc-900 text-[#caffbf]'
                onClick={() => CheckAnswer()}
              >Submit</Button>
            }
            {answered &&
              <Button className='ml-10 bg-zinc-900 text-[#caffbf]'
                onClick={() => NextChord()}
              >Next</Button>
            }

          </div>
        </div>
      </div>
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> Chord Settings </DialogTitle>
            <DialogDescription> Change Chord Trainer Settings </DialogDescription>
          </DialogHeader>
          <ChordSettings
            Settings={settings.current}
            UpdateSettings={UpdateSettings}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { ChordTrainer }
