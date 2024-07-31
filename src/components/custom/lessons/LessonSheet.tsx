import { useEffect, useRef, useState } from "react";
import { sheet, App as Score, ConfigSettings } from '../../../lib/sheet/entry.mjs';
import { AppTopBar } from "../AppTopBar";

interface LSProps {
  config: ConfigSettings;
  load?: string;
  w?: number;
  h?: number;
}

function LessonSheet(props: LSProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasWrapper = useRef<HTMLDivElement>(null);
  const score = useRef<Score | null>(null);
  
  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (canvas.current && canvasWrapper.current) {
      const context = canvas.current.getContext('2d'); 
      if (context) {
        score.current = sheet.CreateApp(
          canvas.current,
          canvasWrapper.current,
          document,
          "",
          (msg) => {console.log(msg)},
          props.config);
        setScoreLoaded(true);
        if (props.load) {
          const cleanUp = props.load.replace(/'/g, '"');
          score.current.LoadSheet(cleanUp);
        }
      }
    }
  }, [])

  return (
     <div className='flex flex-col justify-start h-[500px]'>
    { scoreLoaded &&
      <AppTopBar 
        config={{
          HideNav: true,
          HideInput: true,
          HideSettings: true,
          HideNotes: true,
        }}
        score={score.current}
        playFunc={() => {}}
      />
    }
    <div ref={canvasWrapper} className='flex flex-row justify-center'>
      <canvas className='w-full h-[500px]' ref={canvas}></canvas>
    </div>
    </div>
  )
}

export { LessonSheet }
