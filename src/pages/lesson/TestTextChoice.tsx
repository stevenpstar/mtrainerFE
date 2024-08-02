import { Button } from "@/components/ui/button";
import { Elem, Metadata } from "@/utils/Lesson";
import { CheckIcon, CircleIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

interface TTCProps {
  elem: Elem;
}
function TestTextChoice (props: TTCProps) {
  const { elem } = props;
  const [ selectedAnswer, setSelectedAnswer ] = useState<string>('');
  const [ answerCorrect, setAnswerCorrect ] = useState<boolean>(false);
  const [ answered, setAnswered ] = useState<boolean>(false);

  const buttonDefault = 'mt-4 border border-zinc-800 bg-zinc-950 rounded-none hover:bg-zinc-900 hover:text-zinc-200';
  const buttonSelected = 'mt-4 border border-zinc-800 bg-zinc-800 rounded-none text-zinc-200 hover:text-zinc-200';

  const RenderQuestionNumber = (elem: Elem) => {
    const md = elem.metadata.find(md => md.tag === 'QUESTION_NUMBER');
    if (!md) { return ( <div></div> ) }
    return (
      <span> Question { md.content } </span>
    )
  }

  const CheckAnswer = (): boolean => {
    const answer = selectedAnswer;
    const correctAnswer = elem.metadata.find((md: Metadata) => 
      md.tag === 'CORRECT');
    if (!correctAnswer) {
      console.error("No correct answer found in element metadata");
      return false;
    }
     setAnswered(true);
     setAnswerCorrect(_ => answer === correctAnswer.content);
     return answer === correctAnswer.content;
  }

  return ( 
  <div className='w-full min-w-[600px] mt-12 text-left'>

    <div className='text-2xl mt-6 mb-6 bg-zinc-900 p-4 flex flex-row justify-between'>
      { RenderQuestionNumber(elem) }
      { !answered &&
      <CircleIcon className='mt-2 w-4 h-4 text-zinc-200'/>
      }
      { answered && !answerCorrect &&
      <Cross1Icon className='mt-2 w-4 h-4 text-[#f08080]'/>
      }
      { answered && answerCorrect &&
      <CheckIcon className='mt-2 w-4 h-4 text-[#caffbf]'/>
      }
    </div>
    <p className='p-2'>
      { 
        elem.content.split('|').map((str: string) => {

          if (str.length === 0) { return; }
          if (str[0] === "~") {
            return <span className='musicFontSmall'>{str.substring(1, str.length)}</span>
          } else {
            return <span>{str}</span>
          }
        })
      }
    </p>
      <div className=' w-full flex flex-row justify-start gap-4'>
    {
      elem.metadata.map((md: Metadata) => {
        if (md.tag.includes('OPTION')) {
          return <Button 
            key={md.tag}
            className={selectedAnswer === md.content ? buttonSelected : buttonDefault}
            onClick={() => setSelectedAnswer(md.content)}
          >{md.content}</Button>
        }
      })
    }
    </div>
    <div className='flex flex-row justify-end'>
      <Button className={buttonDefault} onClick={() => CheckAnswer()}>Submit Answer</Button>
    </div>

  </div> )
}

export { TestTextChoice }

