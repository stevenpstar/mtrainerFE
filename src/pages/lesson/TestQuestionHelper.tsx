import { Button } from "@/components/ui/button";
import { Elem, Metadata } from "@/utils/Lesson";
import { CheckIcon, CircleIcon, Cross1Icon } from "@radix-ui/react-icons";

const buttonDefault = 'mt-4 border border-zinc-800 bg-zinc-950 rounded-none hover:bg-zinc-900 hover:text-zinc-200';
const buttonSelected = 'mt-4 border border-zinc-800 bg-zinc-800 rounded-none text-zinc-200 hover:text-zinc-200';

function RenderQuestionNumber(elem: Elem, ans: boolean, correct: boolean) {
  const md = elem.metadata.find(md => md.tag === 'QUESTION_NUMBER');
  if (!md) { return ( <div></div> ) }
  return (
    <div className='text-2xl mt-6 mb-6 bg-zinc-900 p-4 flex flex-row justify-between'>
    <span> Question { md.content } </span>
    { !ans &&
    <CircleIcon className='mt-2 w-4 h-4 text-zinc-200'/>
    }
    { ans && !correct &&
    <Cross1Icon className='mt-2 w-4 h-4 text-[#f08080]'/>
    }
    { ans && correct &&
    <CheckIcon className='mt-2 w-4 h-4 text-[#caffbf]'/>
    }
    </div>
  )
}

function RenderChoices(elem: Elem, selectedAnswer: string, setSelectedAnswer: (ans: string) => void) {
  const elems = elem.metadata.filter((md: Metadata) => md.tag.includes('OPTION'))
    .map((opt: Metadata) => 
      <Button
        key={opt.tag}
        className={selectedAnswer === opt.content ? buttonSelected : buttonDefault}
        onClick={() => setSelectedAnswer(opt.content)}
        >{opt.content}</Button>)
  return elems;
}

function CheckAnswer(
  elem: Elem,
  selectedAnswer: string,
  setAnswered: (b: boolean) => void,
  setAnswerCorrect: (b: boolean) => void): boolean {
  const answer = selectedAnswer;
  const correctAnswer = elem.metadata.find((md: Metadata) => 
    md.tag === 'CORRECT');
  if (!correctAnswer) {
    console.error("No correct answer found in element metadata");
    return false;
  }
   setAnswered(true);
   setAnswerCorrect(answer === correctAnswer.content);
   return answer === correctAnswer.content;
}


export { RenderQuestionNumber, RenderChoices, CheckAnswer }
