import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { sheet, App as application, Message, ConfigSettings } from "../lib/sheet/entry.mjs";

interface SheetProps {
  w: string;
  h: string;
  f: string;
  setParentScore: (score: application) => void;
  callback: (msg: Message) => void;
  config: ConfigSettings;
  setParentCanvas?: (canvas: HTMLCanvasElement) => void;
}

function Sheet (props: SheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    // Get canvas/Create sheet app instance
    if (canvasRef.current && canvasWrapper.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        const app = sheet.CreateApp(canvas, 
          canvasWrapper.current,
          document,
          "",
          (msg) => {
              props.callback(msg);
          }, props.config);
        props.setParentScore(app);
        if (props.setParentCanvas) {
          console.log("do nothing");//props.setParentCanvas(canvasRef);
        }
        }
    }
  }, [])

  return (
      <Box ref={canvasWrapper} w={props.w} h={props.h} >
      <Box pt={2} pb={2}>
      </Box>
        <Box h='100%' w='100%'>
        <canvas ref={canvasRef}></canvas>
        </Box>
      </Box>
  )
}

export { Sheet }
