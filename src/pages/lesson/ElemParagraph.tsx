import { Elem } from "@/utils/Lesson";
import { highlight, pText } from "./Highlighter";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

interface EPProps {
  elem: Elem,
  elems: pText[],
  page: number,
  displayId: number,
  highlights: highlight[],
  setHighlights: (highlights: highlight[]) => void,
  AddHighlight: (p: number, hl: highlight[], sH: (h: highlight[]) => void) => void,
  setDisplayId: (id: number) => void,
  setNoteVal: (note: string) => void,
  setNoteWindowPos: (props: {x: number, y: number}) => void,
  setSelHighlight: (hl: highlight) => void
}
function ElemParagraph (props: EPProps) {

  const { elem, 
    elems,
    page,
    displayId,
    highlights,
    setHighlights,
    AddHighlight,
    setDisplayId,
    setNoteVal,
    setNoteWindowPos,
    setSelHighlight } = props;

  return (
    <div className='w-full'
      onMouseEnter={() => setDisplayId(elem.elementId)}
      onMouseLeave={() => setDisplayId(-1)}
    >
    <div className='flex flex-row justify-end'>
      <Button
        style={{'visibility': displayId === elem.elementId ? 'visible' : 'hidden'}}
        size='sm' 
        className='bg-transparent hover:bg-transparent hover:text-[#f08080]'
        onClick={() => AddHighlight(page,
          highlights,
          setHighlights)}>
        <Pencil1Icon className='w-4 h-4'/>
      </Button>
    </div>
    <p className='p-1' id={`para-${elem.elementId}`}> {
      elems.map((e: pText, i: number) => {
        if (e.highlighted) {
          return ( 
            <span id={`elem-${elem.elementId}-${i}`} 
            onClick={(event) => {
              const target = event.target as HTMLSpanElement;
              const bounds = target.getBoundingClientRect();
              let left = bounds.left;
              const top = bounds.top + bounds.height;
              if (bounds.left + 330 > window.innerWidth) {
                left = window.innerWidth - (450);
              }
              setNoteWindowPos({x: left, y: top});
              if (e.highlight) {
                setNoteVal(e.highlight.note);
                setSelHighlight(e.highlight)
              }
            }}
            className={'hover:cursor-pointer text-zinc-200'}
            style={{'backgroundColor': e.highlight ? e.highlight.colour : '#f08080'}}
            >{e.text}</span>
            )
        } else {
          return ( <span id={`elem-${elem.elementId}-${i}`} >{e.text}</span> )
        }
      })
    } </p></div> );
}

export { ElemParagraph }
