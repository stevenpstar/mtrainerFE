import { useState } from "react";
import { Button } from "../ui/button";

type RhythmArrayEntry = {
  str: string;
  val: number;
}

interface RSProps {
  setToolRhythmValues: (val: number[]) => void;
}

function RhythmSelect(props: RSProps) {

  const { setToolRhythmValues } = props; 

  const defClass = 'flex flex-col px-3 pt-4 pb-0 hover:bg-zinc-800 bg-zinc-900 rounded-none text-zinc-200 musicFontSmall ';
  const [ rhythmValues, setRhythmValues ] = useState<number[]>([0.25]);

  const IsSelected = (val: number) => {
    return rhythmValues.find(v => v === val);
  }

  const ToggleSelect = (val: number) => {
    const indx = rhythmValues.findIndex(v => v === val);
    if (indx === -1) {
      const newValArray = [...rhythmValues];
      newValArray.push(val);
      setRhythmValues(newValArray);
      setToolRhythmValues(newValArray);
    } else {
      const newValArray = [...rhythmValues];
      newValArray.splice(indx, 1);
      setRhythmValues(newValArray);
      setToolRhythmValues(newValArray);
    }
  }

  const GetButtonClass = (val: number) => {
    let c = defClass;
    if (IsSelected(val)) {
      c += 'text-[#f08080]';
    }
    return c;
  }

  // TODO: Move this and/or make it into a map
  const rhythmArr: RhythmArrayEntry[] = [
    {
      str: "\u{d834}" + "\u{dd64}",
      val: 0.0078125,
    },
    {
      str: "\u{d834}" + "\u{dd63}",
      val: 0.015625,
    },
    {
      str: "\u{d834}" + "\u{dd62}",
      val: 0.03125,
    },
    {
      str: "\u{d834}" + "\u{dd61}",
      val: 0.0625,
    },
    {
      str: "\u{d834}" + "\u{dd60}",
      val: 0.125,
    },
    {
      str: "\u{d834}" + "\u{dd5f}",
      val: 0.25,
    },
    {
      str: "\u{d834}" + "\u{dd5e}",
      val: 0.5,
    },
    {
      str: "\uE0A2",
      val: 1,
    },
  ]
  return (
  <div className='h-9 flex flex-row items-center justify-center gap-1'>
    { rhythmArr.map((r: RhythmArrayEntry) => 
    <Button 
      className={GetButtonClass(r.val)}
      key={r.val}
      onClick={() => ToggleSelect(r.val)}>
        {r.str}
      </Button>) }
  </div>
  )
}

export { RhythmSelect }
