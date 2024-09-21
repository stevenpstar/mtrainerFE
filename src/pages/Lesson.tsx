import { Elem, ElemType, Lesson as LessonType, Page, PageType } from "@/utils/Lesson";
import { useEffect, useState } from "react";
import { intervalConfig } from "./intervaltrainer/IntervalConfig";
import { LessonSheet } from "@/components/custom/lessons/LessonSheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AddHighlight, HighlightParagraph, UpdateHighlight, highlight } from "./lesson/Highlighter";
import { ArrowLeftIcon, ArrowRightIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { MenuDropdown } from "@/components/custom/MenuDropdown";
import { TestTextChoice } from "./lesson/TestTextChoice";
import { ElemParagraph } from "./lesson/ElemParagraph";
import { HighlightDisplay } from "./lesson/HighlightDisplay";
import { TestScoreChoice } from "./lesson/TestScoreChoice";

enum TestStatus {
  INPROGRESS = 0,
  PASSED
}

type Test = {
  pageId: number;
  status: TestStatus;
  questions: TestQuestion[];
}

type TestQuestion = {
  id: number;
  answer: string;
}

function Lesson() {

  const [_, setLessonLoaded] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [noteVal, setNoteVal] = useState<string>("");
  const [noteWindowPos, setNoteWindowPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
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
  const [_test, setTests] = useState<Test[]>([]);

  const RenderElementContent = (elem: Elem) => {
    const elems = HighlightParagraph(elem.content,
      highlights.filter(h => h.paragraphId === elem.elementId &&
        h.page === page));
    switch (elem.type) {
      case ElemType.Paragraph:
        return (
          <ElemParagraph
            elem={elem}
            elems={elems}
            page={page}
            displayId={displayId}
            highlights={highlights}
            setHighlights={setHighlights}
            AddHighlight={AddHighlight}
            setDisplayId={setDisplayId}
            setNoteVal={setNoteVal}
            setNoteWindowPos={setNoteWindowPos}
            setSelHighlight={setSelHighlight}
          />
        )
      case ElemType.Sheet:
        return (
          <div className='overflow-hidden'>
            <Separator className='bg-zinc-900' />
            <LessonSheet
              config={intervalConfig}
              load={elem.content}
            />
            <Separator className='bg-zinc-900' />
          </div>
        )
      case ElemType.List:
        return (
          <div>
            <ul className='list-disc leading-8 mt-4 ml-4'>
              {elem.content.split(',').map(e => <li>{e}</li>)}
            </ul>
          </div>
        )
      case ElemType.TextQuestionChoice:
        return (
          <TestTextChoice
            elem={elem}
          />
        )
      case ElemType.SheetQuestionChoice:
        return (
          <TestScoreChoice
            elem={elem}
          />
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

  const RenderTopLink = () => {
    if (page === 0) {
      return (
        <p className='underline flex flex-row gap-2 text-[#ffd6a5]'>
          <ArrowLeftIcon className='mt-1 w-4 h-4' /> Back to Courses </p>
      )
    }
    return (
      <p className='underline flex flex-row gap-2 text-[#ffd6a5] hover:cursor-pointer hover:text-zinc-200'
        onClick={() => setPage(page => page - 1)}
      >
        <ArrowLeftIcon className='mt-1 w-4 h-4' /> Back to {lessonData.pages[page - 1].title} </p>
    )
  }

  const RenderBottomLinks = () => {
    if (page === 0) {
      return (
        <div className='mt-12 flex flex-row justify-between w-full'>
          <p
            className='underline flex flex-row gap-2 text-[#ffd6a5]'>
            <ArrowLeftIcon className='mt-1 w-4 h-4' /> Back to Courses
          </p>
          {page < lessonData.pages.length - 1 &&
            <p
              onClick={() => setPage(page + 1)}
              className='underline flex flex-row gap-2 text-[#ffd6a5]'>
              <ArrowRightIcon className='mt-1 w-4 h-4' /> Next: '{lessonData.pages[page + 1].title}'
            </p>
          }
        </div>
      )
    }
    return (
      <div className='mt-12 flex flex-row justify-between w-full'>
        <p
          onClick={() => setPage(page - 1)}
          className='underline flex flex-row gap-2 text-[#ffd6a5]'>
          <ArrowLeftIcon className='mt-1 w-4 h-4' /> Back: '{lessonData.pages[page - 1].title}`
        </p>
        {page < lessonData.pages.length - 1 &&
          <p
            onClick={() => setPage(page + 1)}
            className='underline flex flex-row gap-2 text-[#ffd6a5]'>
            <ArrowRightIcon className='mt-1 w-4 h-4' /> Next: '{lessonData.pages[page + 1].title}'
          </p>
        }
      </div>
    )
  }

  const LoadTests = (lesson: LessonType) => {
    const tests: Test[] = [];
    const testPages = lesson.pages.filter((p: Page) => p.type === PageType.Test);
    testPages.forEach((tp: Page) => {
      const test: Test = {
        pageId: tp.num,
        status: TestStatus.INPROGRESS,
        questions: tp.elements.filter((e: Elem) => e.type >= ElemType.TextQuestionChoice).map((elem: Elem) => {
          const testQuestion: TestQuestion = {
            id: elem.elementId,
            answer: "",
          };
          return testQuestion;
        }),
      }
      tests.push(test);
    })
    setTests(_ => tests);
  }

  useEffect(() => {
    fetch("/ExampleLesson.json")
      .then(res => res.json())
      .then(lesson => {
        setLessonData(lesson as LessonType);
        setLessonLoaded(true);
        LoadTests(lesson);
      });
  }, [])

  return (
    <div className='flex flex-row justify-start'>
      <div className='flex flex-col bg-zinc-950 text-zinc-200 grow'>

        <HighlightDisplay
          selHighlight={selHighlight}
          highlights={highlights}
          noteVal={noteVal}
          noteWindowPos={noteWindowPos}
          UpdateHighlight={UpdateHighlight}
          setHighlights={setHighlights}
          setNoteVal={setNoteVal}
          setSelHighlight={setSelHighlight}
        />

        <div className='flex flex-row justify-between bg-[#0d0d0f] h-12 w-full overflow-hidden'>
          <MenuDropdown />
          <div className='flex flex-col justify-center h-full pr-4'>
            <div className='rounded-full w-6 h-6 bg-blue-100'></div>
          </div>
        </div>
        <div className='flex flex-row justify-center bg-[#0d0d0f] border-b-2 border-zinc-900'>
          <div className='font-bold bg-[#0d0d0f] max-w-[1480px] pt-8 pb-2 w-[1480px] grow'>
            <h1 className='text-5xl bg-[#0d0d0f] text-left'>{lessonData.title}</h1>
            <div className='flex flex-row justify-start gap-2 mt-4 mb-4'>
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

          <div className='text-left p-12 max-w-[1000px] w-[1000px] shrink'>
            <div>
              {
                RenderTopLink()
              }
            </div>
            <div className='flex flex-row justify-end'>
              <Button
                className='flex flex-row justify-between bg-transparent'
                onClick={() => setShowNotes(!showNotes)}>
                <span className='mr-4'>Show Notes</span><Pencil1Icon />
              </Button>
            </div>
            {lessonData.pages.length > 0 &&
              <h2 className='mb-4 text-2xl'>
                {lessonData.pages[page].title}
              </h2>
            }
            {lessonData.pages.length > 0 &&
              lessonData.pages[page].elements.map(e => RenderElementContent(e))
            }
            {RenderBottomLinks()}
          </div>
          <div className='shrink w-36'>
            <div className='flex flex-col gap-4 justify-start fixed right-2 w-80'>
              {showNotes &&
                highlights.filter(h => h.page === page).map(hl =>
                  <div className='text-zinc-200 bg-zinc-900 border-l-2 p-4' style={{ 'borderColor': hl.colour }}>{hl.note}</div>)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Lesson }
