import { Box, Button, Center, Flex, Icon, Text, ToastId, useToast } from "@chakra-ui/react";
import { IoAddCircleOutline, IoMusicalNotes, IoPlayCircleOutline } from "react-icons/io5";
import { ConfigSettings, Message, MessageType, Note, ReturnMidiNumber, App as application } from '../lib/sheet/entry.mjs';
import { useEffect, useRef, useState } from "react";
import { Sheet } from "./Sheet";
import { LoadEmptySheet } from "./rhythmreading/RGenerator";
import { LuMousePointer } from "react-icons/lu";
import { normalTheme } from "../utils/Theme";
import { Sinth, Note as SinthNote} from "../lib/sinth/main.mjs";
import { HiMiniArrowRight } from "react-icons/hi2";
import { CheckScaleAnswer, GenerateScale, GenerateSinthNotes } from "../generators/ScaleGenerator";
import { IoIosSettings } from "react-icons/io";
import { FloatingControl } from "../components/FloatingControl";
import { HiChevronRight } from "react-icons/hi";

function ScaleNotate() {

  const aSample = useRef<AudioBuffer | null>(null);
  const aScore = useRef<application | null>(null);

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const [score, setScore] = useState<application | null>(null);
  const [inputting, setInputting] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [scaleString, setScaleString] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const scaleSettings: ConfigSettings = {
    CameraSettings: {
      DragEnabled: false,
      ZoomEnabled: false,
      Zoom: 1,
      StartingPosition: { x: 0, y: 150 },
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
      InputValue: 0.25,
    },
    PageSettings: {
      RenderPage: true,
      RenderBackground: false,
      ContainerWidth: false,
      UsePages: true,
      AutoSize: true,
    },
    DefaultStaffType: "single",
    Theme: normalTheme,
  }

  const callback = (msg: Message) => {
    switch (msg.messageData.MessageType) {
      case MessageType.Selection:
        setSelectedNote(msg.messageData.Message.obj as Note);
          playSelectedNote(msg.messageData.Message.obj as Note);
        break;
      case MessageType.AddNote:
        onAddNote(msg.messageData.Message.obj as Note);
        break;
      default:
        setSelectedNote(null);
    }
  }

  const onAddNote = (note: Note) => {
    playSelectedNote(note);
  }

  const playSelectedNote = (note: Note) => {
    const midi = ReturnMidiNumber("treble", 
      note.Line, note.Accidental, 0);
      const sNote: SinthNote = {
      Beat: 1,
      Duration: 2,
      MidiNote: midi,
    }
    if (aSample.current) {
      Sinth.playFull(aSample.current, 120, [sNote], () => {});
    }
  }


  useEffect(() => {
    const aContext: AudioContext = new AudioContext();
    fetch("/A4vH.flac")
    .then (resp => resp.arrayBuffer())
    .then (aBuffer => aContext.decodeAudioData(aBuffer))
    .then (s => aSample.current = s);
  }, [])

  useEffect(() => {
    if (score) {
      LoadEmptySheet(score, 4);
      score.SetNoteValue(0.25);
      aScore.current = score;
      if (aScore.current) {
        LoadEmptySheet(aScore.current, 4);
        setScaleString(GenerateScale(aScore.current));
      }
    }
  }, [score])

  const topButtonColour = 'gray.200';

  const PlayRhythm = () => {
   const sNotes = GenerateSinthNotes(scaleString);
   if (sNotes.length > 0 && aSample.current) {
    Sinth.initplay(sNotes);
    Sinth.playFull(aSample.current, 100, sNotes, () => {});
   }
}

  const CheckAnswer = (): boolean => {
    if (aScore.current) {
      const ans = CheckScaleAnswer(scaleString, aScore.current);
      return ans;
    }
    return false;
  }

// TODO: Move this elsewhere
  const getSelectedNotePosition = (msrIndex: number = 0): {top: number, left: number} => {
    const pos: { top: number, left: number } = {
      top: 0,
      left: 0,
    };
    if (aScore.current === null) { return {top: -100, left: -100}; }
    if (selectedNote === null) { return {top: -100, left: -100}; }

    //measure is always 0 for now
    const camX = aScore.current.Camera.x;
    const camY = aScore.current.Camera.y;
    const msrY = aScore.current.Sheet.Measures[msrIndex].Bounds.y;
    const msrX = aScore.current.Sheet.Measures[msrIndex].Divisions[0].Bounds.x;

    pos.top = (msrY + selectedNote.Bounds.y + camY) * (aScore.current.Camera.Zoom) - 20;
    pos.left = (msrX + selectedNote.Bounds.x + camX) * (aScore.current.Camera.Zoom) - 40;

    if (pos.left > window.innerWidth - 300) {
      pos.left = window.innerWidth - 300;
    }

    return pos;
  }


  return (
  <Box w={'100%'}>
    { selectedNote !== null &&
      <FloatingControl
        score={aScore.current}
        top={getSelectedNotePosition().top}
        left={getSelectedNotePosition().left}
        textColour={topButtonColour}
      />
    }
    <Box top={'0px'} left={'0px'} pos={'fixed'} h='40px' w='100%' bgColor={'blackAlpha.500'}>
      <Flex justify={'space-between'} gap={4}>

      <Box ml={'35px'}>
      <Flex justify={'flex-start'}>
      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoMusicalNotes} color={inputting ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.NoteInput = true;
              setInputting(true);
            }}
          }
        >Input</Button>

      <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={LuMousePointer} color={!inputting ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.NoteInput = false;
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
            if (!aScore.current) {
              return;
            }
            else {
              LoadEmptySheet(aScore.current, 4);
              setScaleString(GenerateScale(aScore.current));
          }}}
        >New Scale</Button>
        </Flex>
        </Box>
        <Box></Box>

        <Flex justify={'flex-end'}>
        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoIosSettings} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
        >Settings</Button>
        </Flex>
       </Flex>
    </Box>
      <Box w={'100%'} >
        <Center top={'0px'} h='550px' bgColor={'#16191f'}>
          <Sheet w='100%' h='600px' f='' setParentScore={setScore} callback={callback} config={scaleSettings}/>
        </Center>
      </Box>
    <Box left={'0px'} pos={'fixed'} h='40px' w='100%'>
      <Center>
      <Flex justify={'center'} gap={4}>
       </Flex>
       </Center>
       <Center>
       <Box><Text color={'gray.300'} fontSize='lg'>
       <Icon as={HiChevronRight} color={'#caffbf'} position={'relative'} top='1px' boxSize={4}/>
       Notate the <span className='highlightColour'>{scaleString}</span> </Text></Box>
       </Center>
       <Center>
       <Flex justify={'flex-end'} w='50%'>
       { !submitted &&
        <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={HiMiniArrowRight} color={'#caffbf'} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              const ans = CheckAnswer();
              setSubmitted(true);
              toastIdRef.current = toast({
                title: ans ? 'Correct!' : 'Mistake.',
                description: ans ? 'You got it right!' : 'Incorrect',
                status: ans ? 'success' : 'error',
                duration: 9000,
                isClosable: true,
              });
            }}
          }
        >Submit</Button>
      }
      { submitted &&
        <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={HiMiniArrowRight} color={'#caffbf'} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              setScaleString(GenerateScale(aScore.current));
              setSubmitted(false);
            }}
          }
        >New Scale</Button>
      }
       </Flex>
       </Center>
    </Box>

  </Box>)
}

export { ScaleNotate }
