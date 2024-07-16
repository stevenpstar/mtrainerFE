import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Icon, IconButton } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { RVis } from "./RVisualiser";
import { Sheet } from "./Sheet";
import { ConfigSettings, App as application } from "../lib/sheet/entry.mjs";
import { GenerateRhythm } from "./rhythmreading/RGenerator";
import { Sinth } from "../lib/sinth/main.mjs";
import { IoAddCircleOutline, IoPlayCircleOutline, IoStopCircleOutline } from "react-icons/io5";
import { normalTheme } from "../utils/Theme";
import { IoIosSettings } from "react-icons/io";
import { HiMicrophone } from "react-icons/hi";
import { FaKeyboard, FaMouse } from "react-icons/fa";

enum InputType {
  MICROPHONE = 0,
  KEYBOARD,
  MOUSE,
  MIDI,
}

function RhythmReading () {

  const [score, setScore] = useState<application | null>(null);
  const [perfectCount, setPerfectCount] = useState<number>(0);
  const [goodCount, setGoodCount] = useState<number>(0);
  const [closeCount, setCloseCount] = useState<number>(0);
  const [missCount, setMissCount] = useState<number>(0);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  // the rhythm test can take + a buffer of 1 beat

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mStream = useRef<MediaStream | null>(null);
  const RDetector = useRef<RVis>(new RVis());
  const detectHit = useRef<boolean>(false);
  const inputType = useRef<InputType>(InputType.KEYBOARD);
  const beatArray = useRef<number[]>([]);
  const startTime = useRef<number>(0);

  const aContext: AudioContext = new AudioContext({sampleRate: 8000});
  const analyser = aContext.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0;

  const getBeats = (beats: number[]) => {
    // reset counts
    setPerfectCount(0);
    setGoodCount(0);
    setCloseCount(0);
    setMissCount(0);
    beats.forEach((b: number, i: number) => {
      if (i >= beatArray.current.length) {
        return;
      }
      rScore(b, beatArray.current[i]);
    });
  }

// TODO: Test function for being close
  const rScore = (time: number, desiredTime: number): void => {
    const perfect = 50;
    const good = 100;
    const closeO = 150;
    const dist = Math.abs(time - desiredTime);
  
    if (dist <= perfect) {
      setPerfectCount(perfectCount => perfectCount + 1);
    } else if (dist <= good) {
      setGoodCount(goodCount => goodCount + 1);
    } else if (dist <= closeO) {
      setCloseCount(closeCount => closeCount + 1);
    } else {
      setMissCount(missCount => missCount + 1);
    }
  }

  const rSettings: ConfigSettings = {
    CameraSettings: {
      DragEnabled: false,
      ZoomEnabled: false,
      Zoom: 1,
      StartingPosition: { x: 0, y: 100 },
      CenterMeasures: false,
      CenterPage: true,
    },
    FormatSettings: {
      MeasureFormatSettings: {
        Selectable: false,
        MaxWidth: 400,
      }
    },
    NoteSettings: {
      InputValue: 0.5,
    },
    PageSettings: {
      RenderPage: true,
      RenderBackground: false,
      ContainerWidth: false,
      UsePages: true,
      AutoSize: true,
    },
    DefaultStaffType: "rhythm",
    Theme: normalTheme,
  }

  const getAudioDevice = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        mStream.current= stream;
        aContext.createMediaStreamSource(mStream.current);
        analyser.connect(aContext.destination);
        mediaRecorder.current = new MediaRecorder(mStream.current);
      })
      .catch((err) => console.error(err));
  }

  if (!mStream.current) {
    getAudioDevice();
  }

  const startRecording = () => {
    startTime.current = new Date().getTime();
    if (inputType.current === InputType.MICROPHONE) {
      if (!canvasRef.current) { return; }
      if (!mediaRecorder.current) { console.log("no media recorder"); return; }
     // mediaRecorder.current.start();
      const context = canvasRef.current.getContext("2d");
  //    const bContext = bCanvasRef.current.getContext("2d");
      if (!context) { return; }
      if (!mStream.current) { return; }
      detectHit.current = true;
      if (beatArray.current.length === 0) { return; }
      RDetector.current.detect(analyser, mStream.current, aContext, canvasRef.current, getBeats, beatArray.current[beatArray.current.length-1] + 600);
      Sinth.playMetronome(aContext, 4, 100);
    } else if (inputType.current === InputType.KEYBOARD) {
      detectHit.current = true;
      RDetector.current.Beats = [];
      Sinth.playMetronome(aContext, 4, 100);
      RDetector.current.detectTimeEnd(stopDetecting, beatArray.current[beatArray.current.length-1] + 600);
    } else if (inputType.current === InputType.MOUSE) {
      detectHit.current = true;
      Sinth.playMetronome(aContext, 4, 100);
      RDetector.current.Beats = [];
      RDetector.current.detectTimeEnd(stopDetecting, beatArray.current[beatArray.current.length-1] + 600);
    }
  }

  const stopDetecting = () => {
    detectHit.current = false;
  }

  const stopRecording = () => {
    if (!mediaRecorder.current) { return; }
    //mediaRecorder.current.stop();
    RDetector.current.stopDetect();
    detectHit.current = false;
  }

  useEffect(() => {
    if (score) {
    beatArray.current = GenerateRhythm(score);
    }
  }, [score])

  const handleKeyDown = () => {
    if (detectHit.current && inputType.current === InputType.KEYBOARD) {
      // TODO: 2400 is metronome buffer, needs to differe depending on tempo
      RDetector.current.Beats.push(new Date().getTime() - startTime.current - 2400);
      getBeats(RDetector.current.Beats);
    }
  }

  const handleMouseDown = () => {
    if (detectHit.current && inputType.current === InputType.MOUSE) {
  // TODO: 2400 is metronome buffer, needs to differe depending on tempo
      RDetector.current.Beats.push(new Date().getTime() - startTime.current - 2400);
      getBeats(RDetector.current.Beats);
    }
  }
  // Setting up keyboard event listeners, might
  // be a better way to do this
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  const topButtonColour = 'gray.200';

  return (<Box w={'100%'}>
    <Box h='40px' w='100%'>
      <Flex w='100%' justify={'space-between'} gap={4}>
      <Box></Box>
      <Box>
      <Flex justify={'center'}>
        <Button aria-label='begin test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoPlayCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => startRecording()}
        >Begin Test</Button>
        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoStopCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => stopRecording()}
        >Stop</Button>

        <Button aria-label='new rhythm' border={'0px solid transparent'} variant='ghost' size='sm' color={'#caffbf'} 
          leftIcon={<Icon as={IoAddCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score)
              GenerateRhythm(score);
          }}
        >New Rhythm</Button>
      </Flex>
      </Box>

        <Flex justify={'flex-end'}>
        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoIosSettings} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => setSettingsOpen(true)}
        ></Button>
        </Flex>

       </Flex>
    </Box>
      <Box w={'100%'} >
        <Center h='550px' bgColor={'#16191f'}>
          <Sheet w='100%' h='600px' f='' setParentScore={setScore} callback={() => {}} config={rSettings}/>
        </Center>
        <Flex gap={4} mt={6} w='100%' justify={'center'}>
          <Box borderRadius={'5px'} color={'#a2d2ff'} 
             fontWeight={600} fontSize={'0.9em'} p={2}>PERFECT: {perfectCount}</Box>
          <Box borderRadius={'5px'} color={'#caffbf'} 
             fontWeight={600} fontSize={'0.9em'} p={2}>GOOD: {goodCount}</Box>
          <Box borderRadius={'5px'} color={'#ffd6a5'} 
             fontWeight={600} fontSize={'0.9em'} p={2}>CLOSE: {closeCount}</Box>
          <Box borderRadius={'5px'} color={'#f08080'} 
             fontWeight={600} fontSize={'0.9em'} p={2}>MISS: {missCount}</Box>
        </Flex>
      </Box>
      { true &&
      <Center w='100%' h={'0px'} bgColor={'white'}>
      <canvas width={'800px'} height={'100px'} ref={canvasRef}></canvas>
      </Center>
      }
      <Drawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} size={'md'}>
        <DrawerOverlay/>
        <DrawerContent bgColor={'#0E1114'} color={'gray.300'}>
          <DrawerCloseButton />
          <DrawerHeader>Settings</DrawerHeader>
          <DrawerBody>
            <Flex justify={'center'}>
              <IconButton
                aria-label='Microphone Input'
                borderRadius={'0px'}
                outline={'0px'}
                border={'0px'}
                color={inputType.current === InputType.MICROPHONE ? '#f08080' : 'gray.100'}
                bgColor={'transparent'}
                _hover={{color: '#f08080', backgroundColor: 'transparent', outline: '0', border: '0'}}
                _focus={{outline: '0', border: '0'}}
                onClick={() => {inputType.current = InputType.MICROPHONE}}
                icon={<Icon as={HiMicrophone} boxSize={6}/>}/>
              <IconButton
                aria-label='Keyboard Input'
                borderRadius={'0px'}
                outline={'0px'}
                border={'0px'}
                color={inputType.current === InputType.KEYBOARD ? '#f08080' : 'gray.100'}
                bgColor={'transparent'}
                _hover={{color: '#f08080', backgroundColor: 'transparent', outline: '0', border: '0'}}
                _focus={{outline: '0', border: '0'}}
                onClick={() => {inputType.current = InputType.KEYBOARD}}
                icon={<Icon as={FaKeyboard} boxSize={6}/>}/>
              <IconButton
                borderRadius={'0px'}
                aria-label='Mouse Input'
                outline={'0px'}
                border={'0px'}
                color={inputType.current === InputType.MOUSE ? '#f08080' : 'gray.100'}
                bgColor={'transparent'}
                _hover={{color: '#f08080', backgroundColor: 'transparent', outline: '0', border: '0'}}
                _focus={{outline: '0', border: '0'}}
                onClick={() => {inputType.current = InputType.MOUSE}}
                icon={<Icon as={FaMouse} boxSize={6}/>}/>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

  </Box>)
}

export { RhythmReading }
