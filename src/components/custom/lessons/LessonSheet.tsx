import { useEffect, useRef, useState } from "react";
import { sheet, App as Score, ConfigSettings } from '../../../lib/sheet/entry.mjs';
import { AppTopBar } from "../AppTopBar";

interface LSProps {
  config: ConfigSettings;
  load?: string;
  w?: number;
  h?: number;
  showTopBar?: boolean;
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
     <div className='relative flex flex-col w-full justify-start h-full z-40'>
    { scoreLoaded && props.showTopBar &&
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
      <canvas className='w-full h-[900px]' ref={canvas}></canvas>
    </div>
    </div>
  )
}

export { LessonSheet }
