import { Box, Button, Center,
Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, GridItem, Icon, List, ListIcon, ListItem, Text, ToastId, useColorModeValue, useToast } from "@chakra-ui/react";
import { Sheet } from "./Sheet";
import { ConfigSettings, Message, MessageType, Note, ReturnMidiNumber, App as application } from "../lib/sheet/entry.mjs";
import { Note as SinthNote, Sinth } from "../lib/sinth/main.mjs";
import { useEffect, useRef, useState } from "react";
import { GenerateNewIntervals } from "../generators/IntervalGenerator";
import { HiMiniArrowRight } from "react-icons/hi2";
import { MdBarChart, MdCancel, MdCheckCircle } from "react-icons/md";
import { IntervalSettings } from "./intervaltrainer/Settings";
import {IoMusicalNotes, IoPlayCircleOutline } from "react-icons/io5";
import {  LuMousePointer2 } from "react-icons/lu";
import { IoIosSettings, IoIosVolumeHigh } from "react-icons/io";
import {  normalTheme } from "../utils/Theme";
import { AiOutlineDelete } from "react-icons/ai";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

type SessionRecord = {
  correct: boolean;
  interval: string;
}

type IntervalRecord = {
  Attempts: number;
  Correct: number;
  Percentage: number;
}

type IntSettings = {
  Unison: boolean;
  min2: boolean;
  Maj2: boolean;
  min3: boolean;
  Maj3: boolean;
  P4: boolean;
  Aug4Dim5: boolean;
  P5: boolean;
  min6: boolean;
  Maj6: boolean
  min7: boolean;
  Maj7: boolean;
  Oct: boolean;
  NeedNotate: boolean;
  NotateCount: number;
  Ascending: boolean;
  Descending: boolean;
  Together: boolean;
  PlaySelect: boolean;
  PlayInput: boolean;
}

function IntervalTrainer() {

  const intervalSettings: ConfigSettings = {
    CameraSettings: {
      DragEnabled: false,
      ZoomEnabled: false,
      Zoom: 1,
      StartingPosition: { x: 0, y: 0 },
      CenterMeasures: true,
      CenterPage: false,
    },
    FormatSettings: {
      MeasureFormatSettings: {
        Selectable: false,
        MaxWidth: 200,
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
    DefaultStaffType: 'single',
    Theme: normalTheme,
  }


  const inputBgColour = useColorModeValue('linear(to-b, #0e1114, #16191f)', 'black');

  const [score, setScore] = useState<application | null>(null);
  const [inputting, setInputting] = useState<boolean>(false);
  const [notes, setNotes] = useState<SinthNote[]>([]);
  const [interval, setInterval] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [sessionRecord, setSessionRecord] = useState<SessionRecord[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const settings = useRef<IntSettings>({
    Unison: true,
    min2: true,
    Maj2: true,
    min3: true,
    Maj3: true,
    P4: true,
    Aug4Dim5: true,
    P5: true,
    min6: true,
    Maj6: true,
    min7: true,
    Maj7: true,
    Oct: true,
    NeedNotate: true,
    NotateCount: 1,
    Ascending: true,
    Descending: true,
    Together: true,
    PlaySelect: true,
    PlayInput: true,
  });

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [recordsOpen, setRecordsOpen] = useState<boolean>(false);

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const aSample = useRef<AudioBuffer | null>(null);
  const aScore = useRef<application | null>(null);

  const correct = new Audio("../src/assets/correct.mp3");
  const incorrect = new Audio("../src/assets/incorrect.mp3");

  const getButtonColour = (intString: string) => {
    let colour = "gray.300";
    if (submitted && answer !== "" && interval === intString) {
      colour = answer === intString ? 'green.300' : 'orange.300';
    } else if (!submitted && answer !== "" && interval === intString) {
      colour = 'blue.300';
    } else if (submitted && answer !== "" && interval !== intString) {
      colour = answer === intString ? 'green.300' : 'transparent';
    }
    return colour;
  }

  const getRecordOfInterval = (interval: string): IntervalRecord => { 
    const iRec: IntervalRecord = {
      Attempts: 0,
      Correct: 0,
      Percentage: -1,
    }

    let attempts = 0;
    let correct = 0;

    sessionRecord.forEach(r => {
      if (r.interval === interval) {
        attempts++;
        correct = r.correct ? correct + 1 : correct;
      }
    });

    const perc = correct / attempts * 100;

    iRec.Attempts = attempts;
    iRec.Correct = correct;
    iRec.Percentage = perc;

    return iRec;
  }

  const newInterval = (score: application) => {
    if (!aScore.current) {
      aScore.current = score;
    }
    setAnswer("");
    setInterval("");
    setSubmitted(false);
    const ans = GenerateNewIntervals(1, aScore.current, settings.current);
    setNotes(ans.notes);
    setAnswer(ans.name);
  }

  const CanSubmit = (): boolean => {
    let canSubmit = false;

    if (!aScore.current) {
      return false;
    }

    if (settings.current.NeedNotate) {
      const noteCount = aScore.current?.Sheet.Measures[0].Notes.filter(n => n.Beat === 1).length;
      if (noteCount === 2 && interval !== "") {
        canSubmit = true;
      }
    } else {
      if (interval !== "") {
        canSubmit = true;
      }
    }

    return canSubmit;
  }

  const answers: string[] = [
    "Unison",
    "min2",
    "Maj2",
    "min3",
    "Maj3",
    "P4",
    "Aug4/Dim5",
    "P5",
    "min6",
    "Maj6",
    "min7",
    "Maj7",
    "Oct"
  ]

  useEffect(() => {
    const aContext: AudioContext = new AudioContext();
    fetch("../src/assets/A4vH.flac")
    .then (resp => resp.arrayBuffer())
    .then (aBuffer => aContext.decodeAudioData(aBuffer))
    .then (s => aSample.current = s);
  }, [])

  useEffect(() => {
    if (score) {
      aScore.current = score;
      newInterval(score);
    } else {
      console.error("NO SCORE?");
    }
  }, [score])

  useEffect(() => {
    if (notes.length > 1 && aSample.current) {
      Sinth.playFull(aSample.current, 120, notes, () => {});
    }
  }, [notes])

  useEffect(() => {
    if (aScore.current) {
      newInterval(aScore.current);
    }
  }, [settings])

  const ConfirmSettings = (s: IntSettings) => {
    settings.current = s;
  }

  // have message expor
  const callback = (msg: Message) => {
    switch (msg.messageData.MessageType) {
      case MessageType.Selection:
        setSelectedNote(msg.messageData.Message.obj as Note);
        if (settings.current.PlaySelect) {
          playSelectedNote(msg.messageData.Message.obj as Note);
        }
        break;
      case MessageType.AddNote:
        onAddNote(msg.messageData.Message.obj as Note);
        break;
      default:
        setSelectedNote(null);
    }
  }

  const onAddNote = (note: Note) => {
    if (settings.current.PlayInput) {
      playSelectedNote(note);
    }
    if (!aScore.current || aScore.current?.Sheet.Measures.length === 0) {
      return;
    }
    if (!aScore.current?.Sheet.Measures[0].Notes) {
      return;
    }
      aScore.current?.Sheet.Measures[0].ClearMeasure([note]);
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

  const CheckCorrect = (): boolean => {
    let answerCorrect = false;
    let notesCorrect = false;
    if (settings.current.NeedNotate) {
      //notes we inputted or were generated on the score
      if (!aScore.current) { return false; }

      const MsrNotes: Note[] = aScore.current?.Sheet.Measures[0].Notes.filter(n => n.Beat === 1).sort((a: Note, b: Note) => {
        return a.Line - b.Line;
      });
      const sortedSNotes = notes.sort((a: SinthNote, b: SinthNote) => {
        return b.MidiNote - a.MidiNote;
      });

      if (MsrNotes.length !== 2 || sortedSNotes.length !== 2) { return false; }

      notesCorrect = sortedSNotes[0].MidiNote === ReturnMidiNumber("treble", MsrNotes[0].Line, MsrNotes[0].Accidental, 0) &&
        sortedSNotes[1].MidiNote === ReturnMidiNumber("treble", MsrNotes[1].Line, MsrNotes[1].Accidental, 0);

    } else { notesCorrect = true; }
    answerCorrect = answer === interval;
    return answerCorrect && notesCorrect;
  }

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

    pos.top = (msrY + selectedNote.Bounds.y + camY) * (aScore.current.Camera.Zoom) - 0;
    pos.left = (msrX + selectedNote.Bounds.x + camX) * (aScore.current.Camera.Zoom) - 120;

    return pos;
  }

  const topButtonColour = 'gray.400';

  return (
    <Grid w='100%' h='100%'
      templateAreas={
      `
      "top"
      "sheet"
      "answers"
      `
      }
      gridTemplateRows={'40px 500px 1fr'}
      gridTemplateColumns={`1fr`}>
      { selectedNote !== null && 
      <Box>
        <Box bgColor={'#16191F'} position={'absolute'} top={getSelectedNotePosition().top} left={getSelectedNotePosition().left} 
          w={selectedNote !== null ? '300px' : '0px'} opacity={selectedNote !== null ? 1 : 0} h='40px' transition={'0.1s'}
           borderRadius={'5px'} boxShadow={'lg'}>
          <Center>
          <Flex justify={'space-evenly'} w='100%' hidden={!selectedNote}>
      <Button 
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.SetAccidental(-1);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE260'}</Box> Flat </Button>

      <Button
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.SetAccidental(0);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE261'}</Box> Natural</Button>

      <Button
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.SetAccidental(1);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE262'}</Box> Sharp</Button>

       <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
        leftIcon={<Icon as={AiOutlineDelete} color={'#f08080'} boxSize={5} />}
        _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
        _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
        onClick={() => {
          if (aScore.current) {
            aScore.current.Delete();
          }}
        }
        >Delete</Button>
        </Flex>
        </Center>
        </Box>
        </Box>
      }
      <GridItem area={'top'} bgColor={'#16191f'}>
      <Box top={'0px'} left={'0px'} pos={'fixed'} h='40px' w='100%' bgColor={'blackAlpha.500'}>
      <Flex justify={'space-between'} w='100%'>
      <Box pl={'35px'}>
      <Flex direction={'row'} justify={'flex-start'}>
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
          leftIcon={<Icon as={LuMousePointer2} color={!inputting ? '#f08080' : topButtonColour} boxSize={6} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (aScore.current) {
              aScore.current.NoteInput = false;
              setInputting(false);
            }}
          }
        >Select</Button>

      <Button aria-label='play interval' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoPlayCircleOutline} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (notes.length > 0 && aSample.current) {
              Sinth.initplay(notes);
              Sinth.play(aSample.current, 120, () => {});
            }}
          }
        >Play</Button>

      <Button aria-label='play interval' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={FaArrowTrendUp} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (notes.length > 0 && aSample.current) {
              const ascendingNotes: SinthNote[] = [];
              notes.sort((a: SinthNote, b: SinthNote) => {
                return a.MidiNote - b.MidiNote;
              })
              for (let b=0;b<notes.length;b++) {
                ascendingNotes.push({
                  Beat: b + 1,
                  Duration: notes[b].Duration,
                  MidiNote: notes[b].MidiNote
                })
              }
              Sinth.initplay(ascendingNotes);
              Sinth.play(aSample.current, 120, () => {});
            }}
          }
        >Asc</Button>

       <Button aria-label='play interval' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={FaArrowTrendDown} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (notes.length > 0 && aSample.current) {
              const descendingNotes: SinthNote[] = [];
              notes.sort((a: SinthNote, b: SinthNote) => {
                return b.MidiNote - a.MidiNote;
              });
              for (let b=0;b<notes.length;b++) {
                descendingNotes.push({
                  Beat: b + 1,
                  Duration: notes[b].Duration,
                  MidiNote: notes[b].MidiNote
                });
              }
              Sinth.initplay(descendingNotes);
              Sinth.play(aSample.current, 120, () => {});
            }}
          }
        >Desc</Button>
      <Button aria-label='play interval' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoIosVolumeHigh} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (notes.length > 0 && aSample.current) {
              Sinth.initplay(notes);
              Sinth.play(aSample.current, 120, () => {});
            }}
          }
        >Volume</Button>
      </Flex>
     </Box>
      <Flex justify={'center'}>

      </Flex>
      <Flex justify={'flex-end'}>
      <Button aria-label='play interval' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={IoIosSettings} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => setSettingsOpen(true)}>Settings</Button>

    <Button aria-label='play interval' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          leftIcon={<Icon as={MdBarChart} boxSize={5} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => setRecordsOpen(true)}>Stats</Button>
      </Flex>
      </Flex>

      </Box>
      </GridItem>

      <GridItem area={'sright'} bgColor={'gray.300'}>
      </GridItem>

      <GridItem area={'sheet'} bgColor='#16191f'>
        <Sheet w='100%' h='500px' f='' setParentScore={setScore} callback={callback} config={intervalSettings}/>
      </GridItem>
      <GridItem area={'answers'} bgColor={inputBgColour} >
      <Center>
      <Box h='100%' maxW='700' w='auto'> 

      <Flex justify={'center'}>



      </Flex>

      <Flex justify={'center'} gap={1} wrap={'wrap'} mt={4} >
        { answers.map((a, i) => 
        <Button 
          size='sm'
          variant='ghost'
          border={0}
          key={i} 
          onClick={() => setInterval(a)}
          _hover={{ backgroundColor: 'transparent', color: 'white', outline: '0', border: '0'}}
          _focus={{ color: '#ffda60' , backgroundColor: 'transparent', border: '0', outline: '0'}}
          color={getButtonColour(a)}>{a}</Button>) }
      </Flex>
      <Flex justify={'flex-end'} p={2} pt={4}>
        { !submitted &&
        <Button isDisabled={!CanSubmit()}
          outline={'0'} border={'0'}
          _hover={{ backgroundColor: 'transparent', color: 'white', outline: '0', border: '0'}}
          _focus={{ color: '#ffda60' , backgroundColor: 'transparent', border: '0', outline: '0'}}
          bgColor={'transparent'} color={'#caffbf'} onClick={() => {
          setSubmitted(true);
          const record = {
            correct: CheckCorrect(),
            interval: interval,
          }
          const records = sessionRecord;
          records.push(record);
          setSessionRecord(records);
          if (record.correct) {
            correct.volume = 0.5;
            correct.play();
          } else {
            incorrect.volume = 0.5;
            incorrect.play();
          }
          toastIdRef.current = toast({
            title: record.correct ? 'Correct!' : 'Mistake.',
            description: record.correct ? 'You got it right!' : 'Incorrect',
            status: record.correct ? 'success' : 'error',
            duration: 9000,
            isClosable: true,
          })
        }}> Submit <Icon as={HiMiniArrowRight} /> </Button>
        }
        { submitted &&
        <Button variant='ghost' bgColor={'transparent'} color={'gray.300'}
          outline={'0'} border={'0'}
          _hover={{ backgroundColor: 'transparent', color: 'white', outline: '0', border: '0'}}
          _focus={{ color: '#ffda60' , backgroundColor: 'transparent', border: '0', outline: '0'}}
          onClick={() => { 
          if (aScore.current) {
            if (toastIdRef.current) {
              toast.close(toastIdRef.current);
            }
           newInterval(aScore.current);
         }}}> Next <Icon as={HiMiniArrowRight} /></Button>
        }

      </Flex>
      </Box>
      </Center>
      </GridItem>
      <Drawer isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} size={'md'}>
        <DrawerOverlay/>
        <DrawerContent bgColor={'#0E1114'} color={'gray.300'}>
          <DrawerCloseButton />
          <DrawerHeader>Interval Settings</DrawerHeader>
          <DrawerBody>
            <IntervalSettings Settings={settings.current} UpdateSettings={ConfirmSettings}/>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer isOpen={recordsOpen} onClose={() => setRecordsOpen(false)} size={'md'}>
        <DrawerOverlay/>
        <DrawerContent bgColor={'#0E1114'} color={'gray.300'}>
          <DrawerCloseButton />
          <DrawerHeader>Session Record</DrawerHeader>
          <DrawerBody>
            <Flex w='100%' h='auto' direction={'row'} justify={'space-between'}>
              <Box h='36px' w='36px' ></Box>
              <Text as={'b'}>Session Stats</Text>
              <Box h='36px' w='36px' ></Box>
            </Flex>
              <Flex w='100%' h='auto' direction={'column'}>
              <Flex w='100%' h='auto' wrap={'wrap'} fontSize={'0.7em'} textAlign={'left'} p={3} justify={'space-between'}>
                {
                   answers.map((a) => {
                    return (
                      <Box bgColor={'#16191F'} w='48%' mt={1} mb={1} p={2}>
                      <Flex w='100%' justify={'space-between'} pr={1}><Text as={'b'}>{a}</Text><Box> { getRecordOfInterval(a).Correct } / { getRecordOfInterval(a).Attempts }  </Box>
                        <Box>{ getRecordOfInterval(a).Percentage >= 0 ? getRecordOfInterval(a).Percentage : " N/A"}%</Box> </Flex>
                      </Box>
                    )
                   }) 
                }
              </Flex>
              <Text as={'h2'}> This Session </Text>
              <List w='100%' maxH={'40%'} overflowY={'auto'} textAlign={'left'} fontSize={'0.8em'}>
              {
                sessionRecord.map((_: SessionRecord, i: number, array: SessionRecord[]) => {
                  const elem: SessionRecord = array[array.length - 1 - i];
                  return (
                    <ListItem p={1} bgColor={i % 2 === 0 ? '#16191F' : '#16191F'}w='100%' key={i}>
                      <ListIcon as={elem.correct ? MdCheckCircle : MdCancel} color={elem.correct ? '#caffbf' : '#f08080'} boxSize={4} />
                      {elem.interval}
                    </ListItem>
                  )
                })
              }
              </List>
              </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </Grid>
  )
}

export { IntervalTrainer, type IntSettings }
