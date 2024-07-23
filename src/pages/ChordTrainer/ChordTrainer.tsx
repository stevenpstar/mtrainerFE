/* Core Chord Trainer Component */
import { useEffect, useRef, useState } from 'react'
import { Message, MessageType, Note, App as Score } from '../../lib/sheet/entry.mjs'
import { Sheet } from '../Sheet';
import { CTSettings } from './CTSettings';
import { Button } from '@/components/ui/button';
import { BarChartIcon, ChevronRightIcon, GearIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import { MusicNotes } from '@/components/custom/MusicNotes';
import { MenuDropdown } from '@/components/custom/MenuDropdown';
import { InputSelectGroup } from '@/components/custom/InputSelectGroup';
import { PlayControls } from '@/components/custom/PlayControls';
import { GenerateChord } from './ChordGenerator';
import { Note as SinthNote, Sinth } from '../../lib/sinth/main.mjs';
import { PlaySelectedNote } from '@/utils/OnSelected';
import { MultiInput } from '@/components/custom/MultiInput';
import { useToast } from '@/components/ui/use-toast';

function ChordTrainer() {

  const { toast } = useToast();

  const aContext = useRef<AudioContext>(new AudioContext());
  const aSample = useRef<AudioBuffer | null>(null);
  const aScore = useRef<Score | null>(null);

  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);
  const [notes, setNotes] = useState<SinthNote[]>([]);
  const [answerStr, setAnswerStr] = useState<string>("");
  const [bits, setBits] = useState<string[]>([]);

  const BitString = (): string => {
    let str = '';
    bits.forEach(b => {
      str += b;
      str += ' ';
    })
    return str;
  }

  const GenChord = () => {
    const data = GenerateChord(aScore.current);
    const n: SinthNote[] = [...data.SNotes];
    setNotes(n);
    setAnswerStr(data.ChordStr);
  }

  const CheckAnswer = (): void => {
    // clean up data by removing any whitespace
    const ans = answerStr.replace(/\s/g, "").toLowerCase();
    const guess = BitString().replace(/\s/g, "").toLowerCase();
    if (guess === ans) {
      toast({
        title: "Correct!",
        description: "You got it right",
      })
    } else {
      toast({
        title: "Incorrect!",
        description: "You got it wrong",
      })
    }
  }

  const callback = (msg: Message) => {
    switch (msg.messageData.MessageType) {
      case MessageType.Selection:
        if (!aSample.current || !aContext.current) {
          return;
        }
        PlaySelectedNote(msg.messageData.Message.obj as Note, aSample.current, aContext.current);
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
      Sinth.playFull(aContext.current, aSample.current, 120, notes, () => {});
    }
  }
  
  useEffect(() => {
    if (!aSample.current) {
      fetch("/A4vH.flac")
      .then (resp => resp.arrayBuffer())
      .then (aBuffer => aContext.current.decodeAudioData(aBuffer))
      .then (s => aSample.current = s);
    }
  }, [])

  return (
    <div className='flex flex-col justify-start h-full'>
      <div className='flex flex-row justify-between h-[50px] bg-zinc-950 font-light text-zinc-100'>
      <div className='flex flex-row justify-start gap-2'>
        <MenuDropdown />
        { scoreLoaded &&
        <InputSelectGroup score={aScore.current} />
        }
      <Separator orientation='vertical' className='bg-zinc-800'/>
        <PlayControls 
          play={() => playChord()}/>
      </div>
      <div className='flex flex-row justify-end gap-2'>
        <Button variant='ghost' className='rounded-none' size='icon'>
          <GearIcon className='h-4 w-4' />
        </Button>
        <Button variant='ghost' className='rounded-none' size='icon'>
          <BarChartIcon className='h-4 w-4' />
        </Button>
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
            onClick={() => GenChord()}>Generate New Chord +</Button>
        </div>
        <div className='flex flex-row justify-center min-w-[500px] text-zinc-200 text-lg -top-[2.5rem] relative'>
          <ChevronRightIcon className='text-[#a2d2ff] h-5 w-5 mt-1'/>
          {
            BitString()
          }
          <Button className='ml-10 bg-zinc-900 text-[#caffbf]'
            onClick={() => CheckAnswer()}
          >Submit</Button>
        </div>
        </div>
          <div className='flex flex-row justify-center'>
          <MultiInput SetBits={setBits}/>
        </div>
      </div>
    </div>
  )
}

export { ChordTrainer }
