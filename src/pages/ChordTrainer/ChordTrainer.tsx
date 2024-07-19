/* Core Chord Trainer Component */
import { useEffect, useRef, useState } from 'react'
import { Message, App as Score } from '../../lib/sheet/entry.mjs'
import { Sheet } from '../Sheet';
import { CTSettings } from './CTSettings';
import { Button } from '@/components/ui/button';
import { BarChartIcon, GearIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import { MusicNotes } from '@/components/custom/MusicNotes';
import { MenuDropdown } from '@/components/custom/MenuDropdown';
import { InputSelectGroup } from '@/components/custom/InputSelectGroup';
import { PlayControls } from '@/components/custom/PlayControls';
import { GenerateChord } from './ChordGenerator';

function ChordTrainer() {

  const aContext = useRef<AudioContext>(new AudioContext());
  const aSample = useRef<AudioBuffer | null>(null);
  const aScore = useRef<Score | null>(null);

  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);

  const callback = (msg: Message) => {
    console.log(msg);
  }

  const setScore = (score: Score) => {
    aScore.current = score;
    setScoreLoaded(true);
    GenerateChord(aScore.current);
  }
  
  useEffect(() => {
    fetch("/A4vH.flac")
    .then (resp => resp.arrayBuffer())
    .then (aBuffer => aContext.current.decodeAudioData(aBuffer))
    .then (s => aSample.current = s);
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
        <PlayControls />
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
      <div className='min-h-[50%] grow bg-zinc-900'></div>
    </div>
  )
}

export { ChordTrainer }
