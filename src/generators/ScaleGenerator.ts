import {
  NoteProps,
  ReturnMidiNumber,
  App as application,
} from "../lib/sheet/entry.mjs";
import { Note as SinthNote } from "../lib/sinth/main.mjs";
import { LoadEmptySheet } from "../pages/rhythmreading/RGenerator";

const SemiTone = 1;
const Tone = 2;

const Scales = new Map<string, number[]>([
  [
    "Major Scale",
    [
      Tone,
      Tone,
      SemiTone,
      Tone,
      Tone,
      Tone,
      SemiTone,
      -SemiTone,
      -Tone,
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
      -Tone,
    ],
  ],
  [
    "Natural Minor Scale",
    [
      Tone,
      SemiTone,
      Tone,
      Tone,
      SemiTone,
      Tone,
      Tone,
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
    ],
  ],
  [
    "Harmonic Minor Scale",
    [
      Tone,
      SemiTone,
      Tone,
      Tone,
      SemiTone,
      Tone + SemiTone,
      SemiTone, // Octave
      -SemiTone,
      -Tone - SemiTone,
      -SemiTone,
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
    ],
  ],
  [
    "Melodic Minor Scale",
    [
      Tone,
      SemiTone,
      Tone,
      Tone,
      Tone,
      Tone,
      SemiTone, // Octave
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
    ],
  ],
  [
    "Mixolydian",
    [
      Tone,
      Tone,
      SemiTone,
      Tone,
      Tone,
      SemiTone,
      Tone,
      -Tone,
      -SemiTone,
      -Tone,
      -Tone,
      -SemiTone,
      -Tone,
      -Tone,
    ],
  ],
]);

// Create scale array that we will randomly choose from, this will be
// configurable through settings. Array consists of string keys for the Scales
// map defined above
function CreateScaleArray(): string[] {
  // TODO: Create settings object, for now add both major and minor scale to scale array
  return [
    "Major Scale",
    "Natural Minor Scale",
    "Harmonic Minor Scale",
    "Melodic Minor Scale",
    "Mixolydian",
  ];
}

function CheckScaleAnswer(scale: string, score: application | null): boolean {
  let answer = true;
  if (!score) {
    console.error("Score not found");
    return false;
  }

  let currentNote = 60;
  if (scale !== "Major Scale") {
    currentNote = 57;
  }

  const scaleInts = Scales.get(scale);
  if (!scale) {
    console.error("No scale match");
    return false;
  }

  const correctNotes: number[] = [];
  const inputNotes: number[] = [];

  correctNotes.push(currentNote);

  scaleInts?.forEach((n) => {
    currentNote += n;
    correctNotes.push(currentNote);
  });

  // TODO: The following is a temporary "correct" check, does not take into account beat. If all notes are on the first beat
  // of measure 1 (For example) it will say correct.
  score.Sheet.Measures.forEach((m) => {
    m.Notes.forEach((n) => {
      if (n.Rest) {
        return;
      }
      inputNotes.push(ReturnMidiNumber("treble", n.Line, n.Accidental, 0));
    });
  });

  if (correctNotes.length !== inputNotes.length) {
    answer = false;
  } else {
    correctNotes.forEach((n: number, i: number) => {
      if (inputNotes[i] !== n) {
        answer = false;
        return;
      }
    });
  }
  return answer;
}

function GenerateSinthNotes(scale: string): SinthNote[] {
  const notes: SinthNote[] = [];
  let currentNote = 60;
  let currentBeat = 1;
  if (scale !== "Major Scale") {
    currentNote = 57;
  }

  const scaleInts = Scales.get(scale);
  if (!scale) {
    console.error("No scale match");
    return [];
  }

  notes.push({
    Beat: currentBeat,
    Duration: 1,
    MidiNote: currentNote,
  });

  scaleInts?.forEach((int: number, indx: number) => {
    currentBeat++;
    currentNote += int;
    const dur = indx === scaleInts.length - 1 ? 2 : 1;
    notes.push({
      Beat: currentBeat,
      Duration: dur,
      MidiNote: currentNote,
    });
  });

  return notes;
}

function GenerateScale(score: application): string {
  LoadEmptySheet(score, 4);
  const pitchMap = score.PitchMap;
  // TODO: This will be a configurable setting/passed in as a parameter
  const scaleArray = CreateScaleArray();
  const chosenScale = scaleArray[Math.floor(Math.random() * scaleArray.length)];
  const startingBeat = 1;
  let startingNote: number = 69;
  // start and end note lines
  let sNoteLine: number = 69;
  let eNoteLine: number = 69;

  if (chosenScale === "Major Scale") {
    startingNote = 60;
  } else {
    startingNote = 57;
  }
  const mappedStartingNote = pitchMap.get(startingNote);
  if (mappedStartingNote) {
    sNoteLine = mappedStartingNote.Line;
  }

  const mappedEndingNote = pitchMap.get(startingNote + 12);
  if (mappedEndingNote) {
    eNoteLine = mappedEndingNote.Line;
  }

  const startNote: NoteProps = {
    Beat: startingBeat,
    Duration: 0.25,
    Line: sNoteLine,
    Rest: false,
    Tied: false,
    Staff: 0,
    Tuple: false,
    Clef: "treble",
    Editable: false,
  };

  const restNote: NoteProps = {
    Beat: 1,
    Duration: 0.25,
    Line: 15,
    Rest: true,
    Tied: false,
    Staff: 0,
    Tuple: false,
    Clef: "treble",
  };

  const endingNote: NoteProps = {
    Beat: 3,
    Duration: 0.5,
    Line: eNoteLine,
    Rest: false,
    Tied: false,
    Staff: 0,
    Tuple: false,
    Clef: "treble",
    Editable: false,
  };

  if (score.Sheet.Measures.length < 2) {
    console.error("Not enough Measures not generated");
    return "";
  } else if (score.Sheet.Measures.length > 3) {
    const firstMeasure = score.Sheet.Measures[0];
    if (firstMeasure.Divisions.length === 0) {
      console.error("No divisions generated");
      return "";
    }

    const lastMeasure = score.Sheet.Measures[3];
    if (lastMeasure.Divisions.length === 0) {
      console.error("No divisions generated");
      return "";
    }

    // peak
    score.AddNoteOnMeasure(
      score.Sheet.Measures[1],
      0.5,
      restNote.Line,
      score.Sheet.Measures[1].Divisions[0],
      restNote.Rest,
    );

    score.AddNoteOnMeasure(
      score.Sheet.Measures[1],
      restNote.Duration,
      restNote.Line,
      score.Sheet.Measures[1].Divisions[1],
      restNote.Rest,
    );

    score.AddNoteOnMeasure(
      score.Sheet.Measures[1],
      0.25,
      endingNote.Line,
      score.Sheet.Measures[1].Divisions[2],
      endingNote.Rest,
    );
    //

    const lastMsrDiv = lastMeasure.Divisions[0];
    const firstMsrDiv = firstMeasure.Divisions[0];

    score.AddNoteOnMeasure(
      firstMeasure,
      startNote.Duration,
      startNote.Line,
      firstMsrDiv,
      startNote.Rest,
    );

    // adding rests to last measure
    score.AddNoteOnMeasure(
      lastMeasure,
      restNote.Duration,
      restNote.Line,
      lastMsrDiv,
      restNote.Rest,
    );

    const newDivLastMsr = lastMeasure.Divisions[1];

    score.AddNoteOnMeasure(
      lastMeasure,
      restNote.Duration,
      restNote.Line,
      newDivLastMsr,
      restNote.Rest,
    );

    score.AddNoteOnMeasure(
      lastMeasure,
      endingNote.Duration,
      startNote.Line,
      lastMeasure.Divisions[2],
      endingNote.Rest,
    );
  }

  score.ResizeMeasures(score.Sheet.Measures);
  return chosenScale;
}

export { GenerateScale, GenerateSinthNotes, CheckScaleAnswer };
