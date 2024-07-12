import { Box, Button, Center, Flex, Icon, ToastId, useToast } from "@chakra-ui/react";
import { IoAddCircleOutline, IoMusicalNote, IoMusicalNotes, IoPlayCircleOutline } from "react-icons/io5";
import { ConfigSettings, App as application } from '../lib/sheet/entry.mjs';
import { useEffect, useRef, useState } from "react";
import { Sheet } from "./Sheet";
import { CompareTranscription, GenerateHiddenRhythm, LoadEmptySheet } from "./rhythmreading/RGenerator";
import { LuMousePointer2 } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { normalTheme } from "../utils/Theme";
import { MdOutlineMusicOff } from "react-icons/md";
import { Sinth, Note as SinthNote} from "../lib/sinth/main.mjs";
import { HiMiniArrowRight } from "react-icons/hi2";
import { IoIosSettings } from "react-icons/io";

function RhythmTranscription() {

  const aSample = useRef<AudioBuffer | null>(null);
  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const [score, setScore] = useState<application | null>(null);
  const [inputting, setInputting] = useState<boolean>(true);
  const [noteValue, setNoteValue] = useState<number>(0.25);
  const [restInput, setRestInput] = useState<boolean>(false);
  const [notes, setNotes] = useState<SinthNote[]>([]);

  const GenerateRhythm = (score: application) => {
    setNotes(GenerateHiddenRhythm(score));
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

  useEffect(() => {
    const aContext: AudioContext = new AudioContext();
    fetch("../src/assets/A4vH.flac")
    .then (resp => resp.arrayBuffer())
    .then (aBuffer => aContext.decodeAudioData(aBuffer))
    .then (s => aSample.current = s);
  }, [])

  useEffect(() => {
    if (score) {
      LoadEmptySheet(score, 4);
    }
  }, [score])

  const topButtonColour = 'gray.200';

  const PlayRhythm = () => {
    if (notes.length > 0 && aSample.current) {
      Sinth.playMetronome(4, 80);
      Sinth.playFull(aSample.current, 80, notes, () => {});
    }
  }

  const CheckAnswer = () => {
    if (score) {
      const ans = CompareTranscription(score, notes);
      toastIdRef.current = toast({
        title: ans ? 'Correct!' : 'Mistake.',
        description: ans ? 'You got it right!' : 'Incorrect',
        status: ans ? 'success' : 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
  <Box w={'100%'}>
    <Box top={'0px'} left={'0px'} pos={'fixed'} h='40px' w='100%'>
      <Flex justify={'space-between'} gap={4}>
      <Box pl={'35px'}>
      <Flex justify={'flex-start'}>
      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoMusicalNotes} color={inputting ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.NoteInput = true;
              setInputting(true);
            }}
          }
        >Input</Button>

      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={LuMousePointer2} color={!inputting ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.NoteInput = false;
              setInputting(false);
            }}
          }
        >Select</Button>

        <Button aria-label='begin test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoPlayCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => PlayRhythm()}
        >Play</Button>

        <Button aria-label='new rhythm' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoAddCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score)
              GenerateRhythm(score);
          }}
        >New</Button>
        </Flex>
        </Box>

        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoIosSettings} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
        >Settings</Button>

       </Flex>
    </Box>
      <Box w={'100%'} >
        <Center top={'0px'} h='550px' bgColor={'#16191f'}>
          <Sheet w='100%' h='600px' f='' setParentScore={setScore} callback={() => {}} config={rSettings}/>
        </Center>
      </Box>
    <Box left={'0px'} pos={'fixed'} h='40px' w='100%'>
      <Center>
      <Flex justify={'center'} gap={4}>
      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoMusicalNote} color={noteValue === 0.125 ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.SetNoteValue(0.125);
              setNoteValue(0.125);
            }}
          }
        >1/8</Button>

      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoMusicalNote} color={noteValue === 0.25 ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.SetNoteValue(0.25);
              setNoteValue(0.25);
            }}
          }
        >1/4</Button>
      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoMusicalNote} color={noteValue === 0.5 ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.SetNoteValue(0.5);
              setNoteValue(0.5);
            }}
          }
        >1/2</Button>

      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={MdOutlineMusicOff} color={restInput === true ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.RestInput = !score.RestInput;
              setRestInput(score.RestInput);
            }}
          }
        >REST</Button>


       <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={AiOutlineDelete} color={'#f08080'} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.Delete();
            }}
          }
        >DELETE</Button>

       </Flex>
       </Center>
       <Center>
       <Flex justify={'flex-end'} w='50%'>
        <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={HiMiniArrowRight} color={'#caffbf'} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              CheckAnswer();
            }}
          }
        >Submit</Button>
       </Flex>
       </Center>
    </Box>

  </Box>)
}

export { RhythmTranscription }
