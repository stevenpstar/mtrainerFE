import { useEffect, useRef, useState } from "react";
import { sheet, App as Score, ConfigSettings } from '../../lib/sheet/entry.mjs';

interface SSProps {
  config: ConfigSettings;
  setParentScore: (score: Score) => void;
  load?: string;
  w?: number;
  h?: number;
  showTopBar?: boolean;
}

function SheetStandard(props: SSProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasWrapper = useRef<HTMLDivElement>(null);
  const score = useRef<Score | null>(null);

  const [_, setScoreLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (canvas.current && canvasWrapper.current) {
      const context = canvas.current.getContext('2d');
      if (context) {
        score.current = sheet.CreateApp(
          canvas.current,
          canvasWrapper.current,
          document,
          "",
          (msg) => { console.log(msg) },
          props.config);
        setScoreLoaded(true);
        props.setParentScore(score.current);
        if (props.load) {
          const cleanUp = props.load.replace(/'/g, '"');
          score.current.LoadSheet(cleanUp);
        }
      }
    }
  }, [])

  return (
    <div className='relative flex flex-col w-full justify-start h-full z-40'>
      <div ref={canvasWrapper} className='flex flex-row justify-center'>
        <canvas className='w-full h-[250px]' ref={canvas}></canvas>
      </div>
    </div>
  )
}

export { SheetStandard }
