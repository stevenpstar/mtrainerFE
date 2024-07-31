import { Elem, ElemType, Lesson as LessonType } from "@/utils/Lesson";
import { useEffect, useState } from "react";
import { intervalConfig } from "./intervaltrainer/IntervalConfig";
import { LessonSheet } from "@/components/custom/lessons/LessonSheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AddHighlight, HighlightParagraph, UpdateHighlight, highlight, pText } from "./lesson/Highlighter";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function Lesson() {

  const [_, setLessonLoaded] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [noteVal, setNoteVal] = useState<string>("");
  const [noteWindowPos, setNoteWindowPos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [displayId, setDisplayId] = useState<number>(-1);
  const [page, setPage] = useState<number>(0);
  const [highlights, setHighlights] = useState<highlight[]>([]);
  const [selHighlight, setSelHighlight] = useState<highlight | null>(null);
  const [lessonData, setLessonData] = useState<LessonType>(
    {
      title: "",
      subtitle: "",
      tags: [],
      pages: [],
    }
  );
  
  const RenderElementContent = (elem: Elem) => {
    const elems = HighlightParagraph(elem.content,
      highlights.filter(h => h.paragraphId === elem.elementId &&
                              h.page === page));
    switch (elem.type) {
      case ElemType.Paragraph: //paragraph
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
                  const top = bounds.top + bounds.height + 20;
                  if (bounds.left + 330 > window.innerWidth) {
                    left = window.innerWidth - (450);
                  }
                  setNoteWindowPos({x: left, y: top});
                  if (e.highlight) {
                    setNoteVal(e.highlight.note);
                  }
                  setSelHighlight(e.highlight)
                }}
                className={'hover:cursor-pointer text-zinc-900'}
                style={{'backgroundColor': e.highlight ? e.highlight.colour : '#f08080'}}
                >{e.text}</span>
                )
            } else {
              return ( <span id={`elem-${elem.elementId}-${i}`} >{e.text}</span> )
            }
          })
        } </p></div> );
      case ElemType.Sheet: //sheet
        return (
        <div className='overflow-hidden'>
          <Separator className='bg-zinc-900'/>
          <LessonSheet 
            config={intervalConfig}
            load={elem.content}
          />
          <Separator className='bg-zinc-900'/>
        </div>
        )
      case ElemType.List: //list
        return (
          <div>
            <ul className='list-disc leading-8'>
              { elem.content.split(',').map(e => <li>{e}</li>) }
            </ul>
          </div>
        )
    }
  }

  const PageNavClass = (num: number) => {
    // returns the tailwind class for each page, depending on if it is the active page
    let defaultClass = 'p-2 hover:bg-zinc-950 text-zinc-200 hover:cursor-pointer border-l-2 border-l-transparent';
    if (num === page) {
      defaultClass = 'p-2 hover:bg-zinc-950 border-l-2 border-l-[#f08080] text-zinc-200 hover:text-zinc-200 hover:cursor-pointer';
    }
    return defaultClass;
  }

  useEffect(() => {
    fetch("/ExampleLesson.json")
    .then(res => res.json())
    .then(lesson => {
      setLessonData(lesson as LessonType);
      setLessonLoaded(true);
    });
  }, [])

  return (
    <div className='flex flex-row justify-start'>
      <div className='flex flex-col bg-zinc-950 text-zinc-200 grow'>

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
        <div className='flex flex-row justify-center bg-[#0d0d0f]'>
          <div className='font-bold bg-[#0d0d0f] max-w-[1480px] pt-8 pb-2 w-[1480px] grow'>
            <h1 className='text-5xl bg-[#0d0d0f] text-left'>{lessonData.title}</h1>
            <h2 className='text-md bg-[#0d0d0f] font-light text-left mb-8'>Author: Steven Star</h2>
            <div className='flex flex-row justify-start gap-2 mt-4'>
              <Badge variant={'outline'} className="text-zinc-200" >Beginner</Badge>
              <Badge variant={'outline'} className="text-zinc-200">Fundamentals</Badge>
            </div>
          </div>
        </div>
        
        <div className='flex flex-row w-full justify-center'>
          <div className='flex flex-col h-svh min-w-72 bg-zinc-950 border-r border-[#0d0d0f]'>
            <ul className='flex flex-col text-left border-l-2 border-zinc-800 mt-12'>
              {lessonData.pages.map(page =>
                <li 
                  onClick={() => setPage(page.num)}
                  className={PageNavClass(page.num)}>{page.title}</li>)}
            </ul>
          </div>

        <div className='text-left p-12 max-w-[1000px]'>
          <div className='flex flex-row justify-end'>
            <Button 
             className='flex flex-row justify-between bg-transparent'
             onClick={() => setShowNotes(!showNotes)}>
            <span className='mr-4'>Show Notes</span><Pencil1Icon />
            </Button>
          </div>
          { lessonData.pages.length > 0 &&
          <h2 className='mb-4 text-2xl'>
            {lessonData.pages[page].title}
          </h2>
          }
          { lessonData.pages.length > 0 &&
            lessonData.pages[page].elements.map(e => RenderElementContent(e))
          }
        </div>
        <div className='shrink w-36'>
          <div className='flex flex-col gap-4 justify-start fixed right-2 w-80'>
            { showNotes &&
              highlights.filter(h => h.page === page).map(hl => <div className='text-zinc-200 border-2 p-4' style={{'borderColor': hl.colour}}>{hl.note}</div>)
            }
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export { Lesson }
