import { App as Score } from '../../lib/sheet/entry.mjs'
import { Separator } from '../ui/separator';
import { Toggle } from '../ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
interface IMNProps {
  c: string;
  score: Score | null;
  defaultVal: string;
}
function MusicNotes(props: IMNProps) {
  const { c, score, defaultVal } = props;

  const buttonClass: string = 'flex flex-col pt-4 pb-0 hover:bg-zinc-800 data-[state=on]:bg-zinc-800 rounded-none data-[state=on]:text-[#f08080]';
  const buttonClassNoPadding: string = 'flex flex-col pb-0 hover:bg-zinc-800 data-[state=on]:bg-zinc-800 rounded-none data-[state=on]:text-[#f08080]';
  const musicFontClass: string = 'musicFontSmall'

  const setNoteValue = (val: number): void => {
    if (score) {
      score.SetNoteValue(val);
    }
  }

  const setAccidental = (acc: number): void => {
    if (score) 
      score.SetAccidental(acc);
  }
  return (
    <div className={c}>
    <ToggleGroup defaultValue={defaultVal} type='single'>
      <ToggleGroupItem
         value='0.0078125'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.0078125)}>
         <span className={musicFontClass}>{'\ud834' + '\udd64'}</span>
       </ToggleGroupItem>

      <ToggleGroupItem 
         value='0.015625'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.015625)}>
         <span className={musicFontClass}>{'\ud834' + '\udd63'}</span>
       </ToggleGroupItem>

      <ToggleGroupItem 
        value='0.03125'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.03125)}>
         <span className={musicFontClass}>{'\ud834' + '\udd62'}</span>
       </ToggleGroupItem>

       <ToggleGroupItem 
         value='0.0625'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.0625)}>
         <span className={musicFontClass}>{'\ud834' + '\udd61'}</span>
       </ToggleGroupItem>

       <ToggleGroupItem 
         value='0.125'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.125)}>
         <span className={musicFontClass}>{'\ud834' + '\udd60'}</span>
       </ToggleGroupItem>

      <ToggleGroupItem 
         value='0.25'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.25)}>
         <span className={musicFontClass}>{'\ud834' + '\udd5f'}</span>
       </ToggleGroupItem>

       <ToggleGroupItem 
         value='0.5'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(0.5)}>
         <span className={musicFontClass}>{'\ud834' + '\udd5e'}</span>
       </ToggleGroupItem>

      <ToggleGroupItem 
         value='1'
         variant='default' 
         className={buttonClass}
         onClick={() => setNoteValue(1)}>
         <span className={musicFontClass}>{'\uE0A2'}</span>
       </ToggleGroupItem>
    </ToggleGroup>

    <Separator orientation='vertical' className='bg-zinc-800' />

    <Toggle aria-label='Toggle Rest Input'
      variant='default'
      className={buttonClassNoPadding}
      onClick={() => {
        if (score)
          score.RestInput = !score.RestInput;
      }}
    >
      <span className={'musicFont'}>{'\uE4E5'}</span>
    </Toggle>

    <ToggleGroup type='single'>

       <ToggleGroupItem 
         value='flat'
         variant='default' 
         className={buttonClassNoPadding}
         onClick={() => setAccidental(-1)}>
         <span className={'musicFont'}>{'\uE260'}</span>
       </ToggleGroupItem>

       <ToggleGroupItem 
         value='natural'
         variant='default' 
         className={buttonClassNoPadding}
         onClick={() => setAccidental(0)}>
         <span className={'musicFont'}>{'\uE261'}</span>
       </ToggleGroupItem>

       <ToggleGroupItem 
         value='sharp'
         variant='default' 
         className={buttonClassNoPadding}
         onClick={() => setAccidental(1)}>
         <span className={'musicFont'}>{'\uE262'}</span>
       </ToggleGroupItem>

    </ToggleGroup>
    <Separator orientation='vertical' className='bg-zinc-800' />
    </div>
  )
}

export { MusicNotes }
