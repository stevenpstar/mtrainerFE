import { LessonSheet } from "@/components/custom/lessons/LessonSheet";
import { intervalConfig } from "../intervaltrainer/IntervalConfig";
import { Elem } from "@/utils/Lesson";
import { CheckAnswer, RenderChoices, RenderQuestionNumber } from "./TestQuestionHelper";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TSCProps {
  elem: Elem,
}

function TestScoreChoice (props: TSCProps) {

  const buttonDefault = 'mt-4 border border-zinc-800 bg-zinc-950 rounded-none hover:bg-zinc-900 hover:text-zinc-200';
  const [ selectedAnswer, setSelectedAnswer ] = useState<string>('');
  const [ answerCorrect, setAnswerCorrect ] = useState<boolean>(false);
  const [ answered, setAnswered ] = useState<boolean>(false);

  const { elem } = props;

  return (
    <div>
    { RenderQuestionNumber(elem, answered, answerCorrect) }
    <LessonSheet 
      config={intervalConfig}
    />
    <div className='flex flex-row justify-start gap-2'>
      { RenderChoices(elem, selectedAnswer, setSelectedAnswer) }
    </div>
    <div className='flex flex-row justify-end'>
      <Button className={buttonDefault} onClick={() => 
        CheckAnswer(elem, selectedAnswer, setAnswered, setAnswerCorrect)}>Submit Answer</Button>
    </div>
    </div>
  )
}

export { TestScoreChoice }
