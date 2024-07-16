import { Box, Button, Center, Flex, Icon, IconButton, Text, ToastId, useToast } from "@chakra-ui/react";
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
import { HiChevronRight } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";

function ScaleNotate() {

  const aSample = useRef<AudioBuffer | null>(null);
  const aContext = useRef<AudioContext>(new AudioContext());
  const aScore = useRef<application | null>(null);

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const [score, setScore] = useState<application | null>(null);
  const [inputting, setInputting] = useState<boolean>(true);
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
          playSelectedNote(msg.messageData.Message.obj as Note);
        break;
      case MessageType.AddNote:
        onAddNote(msg.messageData.Message.obj as Note);
        break;
      default:
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
      Sinth.playFull(aContext.current, aSample.current, 120, [sNote], () => {});
    }
  }


  useEffect(() => {
    fetch("/A4vH.flac")
    .then (resp => resp.arrayBuffer())
    .then (aBuffer => aContext.current.decodeAudioData(aBuffer))
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
    Sinth.playFull(aContext.current, aSample.current, 100, sNotes, () => {});
   }
}

  const CheckAnswer = (): boolean => {
    if (aScore.current) {
      const ans = CheckScaleAnswer(scaleString, aScore.current);
      return ans;
    }
    return false;
  }

  return (
  <Box w={'100%'}>
    <Flex 
      direction={'column'}
      justify={{base: 'space-between', sm: 'space-between', md: 'flex-start'}}
      w='100%'
      h='100%' bgColor={'#0D0F12'}>
    <Box h='40px' w='100%' bgColor={'blackAlpha.500'}>
      <Flex justify={'space-between'} gap={4} >
      <Box></Box>
      <Box>
      <Flex justify={'center'}>
      <IconButton aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          icon={<Icon as={IoMusicalNotes} color={inputting ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.NoteInput = true;
              setInputting(true);
            }}
          }
        ></IconButton>

      <IconButton aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          icon={<Icon as={LuMousePointer} color={!inputting ? '#f08080' : topButtonColour} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.NoteInput = false;
              setInputting(false);
            }}
          }
        ></IconButton>

        <IconButton aria-label='begin test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          icon={<Icon as={IoPlayCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => PlayRhythm()}
        ></IconButton>

        <Button aria-label='new rhythm' border={'0px solid transparent'} variant='ghost' size='sm' color={'#caffbf'} 
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

      <Button 
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.SetAccidental(-1);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE260'}</Box></Button>

      <Button
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.SetAccidental(0);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE261'}</Box></Button>

      <Button
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.SetAccidental(1);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE262'}</Box></Button>

       <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
        leftIcon={<Icon as={AiOutlineDelete} color={'#f08080'} boxSize={5} />}
        _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
        _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
        onClick={() => {
          if (aScore.current) {
            aScore.current.Delete();
          }}
        }
        ></Button>

        </Flex>
        </Box>

        <Flex justify={'flex-end'}>
        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoIosSettings} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
        ></Button>
        </Flex>
       </Flex>
    </Box>
      <Box w={'100%'} bgColor={'#0e1114'} >
        <Center top={'0px'} h='550px'>
          <Sheet w='100%' h='600px' f='' setParentScore={setScore} callback={callback} config={scaleSettings}/>
        </Center>
      </Box>
    <Box h='100px' p={2} w='100%' bgColor={'#0D0F12'}>
    <Box h='40px' w='100%'>
      <Center>
      <Flex justify={'center'} gap={4}>
       </Flex>
       </Center>
       <Center>
     <Box><Text color={'gray.300'} fontSize='lg'>
       <Icon as={HiChevronRight} color={'#caffbf'} position={'relative'} top='1px' boxSize={4}/>
       Notate the <span className='highlightColour'>{scaleString}</span> </Text>
      </Box>
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
    </Box>
  </Flex>
  </Box>)
}

export { ScaleNotate }
