import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {  App as Score } from '../../lib/sheet/entry.mjs'
import { CursorArrowIcon, CursorTextIcon } from '@radix-ui/react-icons';

interface ISGProps {
  score: Score | null;
}

function InputSelectGroup(props: ISGProps) {
  const { score } = props;
  return (
        <ToggleGroup defaultValue='menu' type='single'>
          <ToggleGroupItem className='rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:border-b-2 
            data-[state=on]:border-[#f08080] data-[state=on]:bg-zinc-900 data-[state=on]:text-zinc-100' value='input'
            onClick={() => {
              if (score) {
                score.NoteInput = true;
              }
            }}>
            <CursorTextIcon />
           </ToggleGroupItem>
         <ToggleGroupItem className='rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:border-b-2 
            data-[state=on]:border-[#f08080] data-[state=on]:bg-zinc-900 data-[state=on]:text-zinc-100' value='select'
            onClick={() => {
              if (score) 
                score.NoteInput = false;
            }}>
           <CursorArrowIcon />
         </ToggleGroupItem>
       </ToggleGroup>

)
}

export { InputSelectGroup }
