import { Textarea } from "@/components/ui/textarea";
import { highlight } from "./Highlighter";
import { Button } from "@/components/ui/button";

interface HLDProps {
  selHighlight: highlight | null,
  highlights: highlight[],
  noteVal: string,
  noteWindowPos: { x: number, y: number },
  UpdateHighlight: (sel: highlight, hls: highlight[],
    setHls: (shls: highlight[]) => void, col: string, note: string) => void,
  setHighlights: (hl: highlight[]) => void,
  setNoteVal: (note: string) => void,
  setSelHighlight: (hl: highlight | null) => void,
}
function HighlightDisplay (props: HLDProps) {
  const { 
    selHighlight,
    highlights,
    noteVal,
    noteWindowPos,
    UpdateHighlight,
    setHighlights,
    setNoteVal,
    setSelHighlight,
    } = props;
  return (
        <div id='comments' className='absolute flex flex-col justify-start gap-2'
          style={{'display': selHighlight ? 'block': 'none',
            'left': noteWindowPos.x , 'top': noteWindowPos.y + 50
          }}
        >
          <div className='w-96 min-h-48 bg-zinc-900 mr-4 mt-4 p-2 rounded shadow-md border-zinc-800 border-2'>
          <h2> Add Note </h2>
          <div className='flex flex-row justify-start gap-1'>
            <div 
              onClick={() => {
                if (selHighlight) {
                  UpdateHighlight(selHighlight, highlights, setHighlights, '#caffbf', selHighlight?.note); 
                }
               }}
              className='w-4 h-4 rounded bg-[#caffbf]'></div>
            <div 
              onClick={() => {
                if (selHighlight) {
                  UpdateHighlight(selHighlight, highlights, setHighlights, '#f08080', selHighlight?.note); 
                }
               }}
            className='w-4 h-4 rounded bg-[#f08080]'></div>
            <div 
              onClick={() => {
                if (selHighlight) {
                  UpdateHighlight(selHighlight, highlights, setHighlights, '#a2d2ff', selHighlight?.note); 
                }
               }}
            className='w-4 h-4 rounded bg-[#a2d2ff]'></div>
            <div 
              onClick={() => {
                if (selHighlight) {
                  UpdateHighlight(selHighlight, highlights, setHighlights, '#ffd6a5', selHighlight?.note); 
                }
               }}
            className='w-4 h-4 rounded bg-[#ffd6a5]'></div>
          </div>
          <div className='mt-2 mb-2'>
          <Textarea 
            value={noteVal}
            onChange={(e) => setNoteVal(e.currentTarget.value)}
            className='border-none bg-zinc-800' rows={4}></Textarea>
          </div>
          <div className='flex flex-row justify-end'>
            <Button 
              onClick={() => { 
                if (selHighlight) {
                  UpdateHighlight(selHighlight, highlights, setHighlights, selHighlight?.colour, noteVal);
                  setSelHighlight(null);
                  setNoteVal('');
                }
              }}
              className='bg-zinc-900 hover:bg-[#caffbf] hover:text-zinc-900' size='sm'>
              Save</Button>
          </div>
          </div>
        </div>
  )
}

export { HighlightDisplay }
