import { Separator } from '@radix-ui/react-separator';
import { App as Score } from '../../lib/sheet/entry.mjs';
import { InputSelectGroup } from './InputSelectGroup';
import { MenuDropdown } from './MenuDropdown';
import { PlayControls } from './PlayControls';
import { Button } from '../ui/button';
import { BarChartIcon, GearIcon } from '@radix-ui/react-icons';
import { MusicNotes } from './MusicNotes';

// For hiding and disabling certain functionality
type ATBConfig = {
  HideNav?: boolean;
  HideInput?: boolean;
  HideNotes?: boolean;
  HideSettings?: boolean;
}

interface ATBProps {
  score: Score | null;
  config?: ATBConfig;
  playFunc: () => void;
}

function AppTopBar(props: ATBProps) {
  
  const IsEnabled = (key: keyof ATBConfig) => {
    if (props.config === undefined) {
      return true;
    }
    if (props.config[key] === undefined) {
      return true;
    }
    if (props.config[key]) {
      return false;
    }
  }

  const { score, config, playFunc } = props;
  return (
  <div>
    <div className='flex flex-row justify-between h-[50px] bg-zinc-950 font-light text-zinc-100'>
      <div className='flex flex-row justify-start gap-2'>
      { IsEnabled('HideNav') && 
        <MenuDropdown />
      }
      <InputSelectGroup 
        HideInput={config?.HideInput ? config.HideInput : false}
        HideSelect={false}
        score={score} />
      <Separator orientation='vertical' className='bg-zinc-800'/>
        <PlayControls 
          play={() => playFunc()}
          stop={() => {}}/>
      </div>

      { IsEnabled('HideSettings') &&
      <div className='flex flex-row justify-end gap-2'>
        <Button variant='ghost' className='rounded-none' size='icon'>
          <GearIcon className='h-4 w-4' />
        </Button>
        <Button variant='ghost' className='rounded-none' size='icon'>
          <BarChartIcon className='h-4 w-4' />
        </Button>
      </div>
      }
      </div>
      { IsEnabled('HideNotes') &&
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
      }
    </div>
  )
}

export { AppTopBar }
