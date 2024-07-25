import { Separator } from '@radix-ui/react-separator';
import { App as Score } from '../../lib/sheet/entry.mjs';
import { InputSelectGroup } from './InputSelectGroup';
import { MenuDropdown } from './MenuDropdown';
import { PlayControls } from './PlayControls';
import { Button } from '../ui/button';
import { BarChartIcon, GearIcon } from '@radix-ui/react-icons';
import { MusicNotes } from './MusicNotes';

interface ATBProps {
  score: Score | null;
  playFunc: () => void;
}

function AppTopBar(props: ATBProps) {
  const { score, playFunc } = props;
  return (
  <div>
    <div className='flex flex-row justify-between h-[50px] bg-zinc-950 font-light text-zinc-100'>
      <div className='flex flex-row justify-start gap-2'>
        <MenuDropdown />
        <InputSelectGroup score={score} />
      <Separator orientation='vertical' className='bg-zinc-800'/>
        <PlayControls 
          play={() => playFunc()}
          stop={() => {}}/>
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
            score={score}
            defaultVal='0.5'
          />
        </div>
        </div>
      </div>
    </div>
  )
}

export { AppTopBar }
