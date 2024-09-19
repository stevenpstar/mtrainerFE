import { useToast } from '@/components/ui/use-toast';
import { Sheet } from "./Sheet";
import { Message, MessageType, Note, ReturnMidiNumber, App as Score } from "../lib/sheet/entry.mjs";
import { Note as SinthNote, Sinth } from "../lib/sinth/main.mjs";
import { useEffect, useRef, useState } from "react";
import { GenerateNewIntervals } from "../generators/IntervalGenerator";
import { IntSettings } from "./intervaltrainer/Settings";
import { IntervalAnswers } from "./intervaltrainer/IntervalAnswers";
import { MenuDropdown } from "@/components/custom/MenuDropdown";
import { InputSelectGroup } from "@/components/custom/InputSelectGroup";
import { Separator } from "@/components/ui/separator";
import { PlayControls } from "@/components/custom/PlayControls";
import { MusicNotes } from "@/components/custom/MusicNotes";
import { intervalConfig } from "./intervaltrainer/IntervalConfig";
import { Button } from "@/components/ui/button";

type SessionRecord = {
  correct: boolean;
  interval: string;
}

enum PlayOrder {
  ASCENDING = 0,
  DESCENDING,
  TOGETHER,
  ASC_DESC,
  ASC_TOG_DESC,
  ASC_TOG,
  DESC_TOG,
}

function IntervalTrainer() {

  const [notes, setNotes] = useState<SinthNote[]>([]);
  const [interval, setInterval] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreLoaded, setScoreLoaded] = useState<boolean>(false);

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
    min9: true,
    Maj9: true,
    min10: true,
    Maj10: true,
    NeedNotate: false,
    NotateCount: 1,
    Ascending: true,
    Descending: true,
    Together: true,
    PlaySelect: true,
    PlayInput: true,
  });

  const { toast } = useToast();

  const aSample = useRef<AudioBuffer | null>(null);
  const aScore = useRef<Score | null>(null);
  const aContext = useRef<AudioContext>(new AudioContext());

  const correct = new Audio("/correct.mp3");
  const incorrect = new Audio("/incorrect.mp3");

  const getButtonColour = (intString: string) => {
    let colour = "gray-300";
    if (submitted && answer !== "" && interval === intString) {
      colour = answer === intString ? 'green-300' : 'orange-300';
    } else if (!submitted && answer !== "" && interval === intString) {
      colour = 'blue-300';
    } else if (submitted && answer !== "" && interval !== intString) {
      colour = answer === intString ? 'green-300' : 'transparent';
    }
    return colour;
  }

  const Submit = () => {
    setSubmitted(true);
    const record: SessionRecord = {
      correct: CheckCorrect(),
      interval: interval,
    }
    if (record.correct) {
      correct.volume = 0.5;
      correct.play();
    } else {
      incorrect.volume = 0.5;
      incorrect.play();
    }
    toast({
      title: record.correct ? 'Correct!' : 'Mistake.',
      description: record.correct ? 'You got it right!' : 'Incorrect',
      variant: record.correct ? 'correct' : 'incorrect',
    })
  }

  const newInterval = (score: Score) => {
    if (!aScore.current) {
      aScore.current = score;
    }
    setAnswer("");
    setInterval("");
    setSubmitted(false);
    const ans = GenerateNewIntervals(1, aScore.current, settings.current);
    const newNotes: SinthNote[] = [...ans.notes];
    setNotes(_ => newNotes);
    setAnswer(ans.name);
    Play(newNotes);
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

  useEffect(() => {
    if (!aSample.current) {
      fetch("/A4vH.flac")
        .then(resp => resp.arrayBuffer())
        .then(aBuffer => aContext.current.decodeAudioData(aBuffer))
        .then(s => aSample.current = s);
    }
  }, [])

  const setScore = (score: Score) => {
    aScore.current = score;
    setScoreLoaded(true);
  }

  // have message expor
  const callback = (msg: Message) => {
    switch (msg.messageData.MessageType) {
      case MessageType.Selection:
        if (settings.current.PlaySelect) {
          playSelectedNote(msg.messageData.Message.obj as Note);
        }
        break;
      case MessageType.AddNote:
        onAddNote(msg.messageData.Message.obj as Note);
        break;
      default:
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
      Sinth.playFull(aContext.current, aSample.current, 120, [sNote], () => { });
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

  const Play = (n?: SinthNote[]) => {
    const notesFound = notes.length > 0 || n && n.length > 0;
    if (aScore.current && aContext.current && aSample.current && notesFound) {
      if (n) {
        Sinth.initplay(n);
      }
      else {
        Sinth.initplay([...notes]);
      }
      Sinth.play(aContext.current, aSample.current, 120, () => { });
    }
  }

  const PlayIntOrder = (order: PlayOrder) => {
    if (notes.length > 0) {
      const ascNotes: SinthNote[] = JSON.parse(JSON.stringify(notes));
      // TODO: Add more play order configuration / implementations
      if (order === PlayOrder.DESCENDING) {
        ascNotes.sort((a: SinthNote, b: SinthNote) => b.MidiNote - a.MidiNote);
      } else {
        ascNotes.sort((a: SinthNote, b: SinthNote) => a.MidiNote - b.MidiNote);
      }
      ascNotes.forEach((n: SinthNote, i: number) => {
        if (i > 0) {
          n.Beat += 1;
        }
      });
      Play(ascNotes);
    }
  }

  return (
    <div className='flex flex-col justify-start h-full'>
      <div className='flex flex-row justify-between h-[50px] bg-zinc-950 font-light text-zinc-100'>
        <div className='flex flex-row justify-start gap-2'>
          <MenuDropdown />
          {scoreLoaded &&
            <InputSelectGroup score={aScore.current} />
          }
          <Separator orientation='vertical' className='bg-zinc-800' />
          <PlayControls
            play={() => PlayIntOrder(PlayOrder.ASCENDING)}
            stop={() => { }} />
        </div>
        <div className='flex flex-row justify-end gap-2'>
        </div>
      </div>
      <div className='flex flex-row justify-between h-[50px] bg-zinc-900 font-light text-zinc-300 shadow-md z-50'>
        <div className='flex flex-col justify-center h-full'>
          <div className='flex flex-row justify-start gap-2'>
            <MusicNotes
              c='h-9 flex flex-row items-center justify-center gap-2'
              score={aScore.current}
              defaultVal="0.5" />
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-center'>
        <div className='grow testbg'>
          <Sheet
            w='100%'
            h='500px'
            f=''
            setParentScore={setScore}
            callback={callback}
            config={intervalConfig} />
        </div>
      </div>
      <div className='min-h-[50%] grow bg-zinc-950'>
        <div className='flex flex-row justify-center'>
          <Button
            className='-top-[3.5rem] relative bg-zinc-900 text-[#caffbf]'
            onClick={() => {
              if (aScore.current)
                newInterval(aScore.current);
            }}>Generate New Interval +</Button>
        </div>
        <div className='flex mt-4 flex-row justify-center'>
          <div className='flex flex-row justify-center -top-[2.5rem] relative'>
            <IntervalAnswers
              setInterval={setInterval}
              getButtonColour={getButtonColour}
            />
          </div>
        </div>
        <div className='flex flex-row justify-center w-full'>
          <div className='flex flex-row justify-end min-w-[500px]'>
            {!submitted &&
              <Button disabled={!CanSubmit()}
                className='ml-10 bg-zinc-900 text-[#caffbf]'
                onClick={() => Submit()}> Submit </Button>
            }
            {submitted &&
              <Button
                className='ml-10 bg-zinc-900 text-[#caffbf]'
                onClick={() => {
                  if (aScore.current) {
                    newInterval(aScore.current);
                  }
                }}> Next </Button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export { IntervalTrainer, type IntSettings }
