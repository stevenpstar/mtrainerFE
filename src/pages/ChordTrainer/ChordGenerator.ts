import { Note, NoteProps, App as Score } from "../../lib/sheet/entry.mjs";
import { LoadEmptySheet } from "../rhythmreading/RGenerator";
import { Note as SinthNote } from "../../lib/sinth/main.mjs";

type ChordData = {
  SNotes: SinthNote[];
  ChordStr: string;
};

// Key definitions

const MAJOR = new Map<string, string[]>([
  ["#", ["C", "G", "D", "A", "E", "B", "F#"]],
  ["b", ["Gb", "Db", "Ab", "Eb", "Bb", "F"]],
]);

const MINOR = new Map<string, string[]>([
  ["#", ["E", "B", "F#", "C#", "G#", "D#"]],
  ["b", ["Gb", "Db", "Ab", "Eb", "Bb", "F"]],
]);

// Define chords

const CHORDS = new Map<string, Array<number[]>>([
  [
    "MAJOR",
    [
      [0, 4, 7],
      [-8, -5, 0],
      [-8, 0, -5],
      [-5, 0, 4],
      [-5, 4, 0],
    ],
  ],
  [
    "MAJOR 7",
    [
      [0, 4, 7, 11],
      [-8, -5, 0, -1],
      [-5, -1, 0, 4],
    ],
  ],
  [
    "MINOR",
    [
      [0, 3, 7],
      [-9, -5, 0],
      [-9, 0, -5],
      [-5, 0, 3],
      [-5, 3, 0],
    ],
  ],
  [
    "MINOR 7",
    [
      [0, 3, 7, 10],
      [-9, -5, 0, -2],
      [-5, -2, 0, 3],
    ],
  ],
  [
    "DIMINISHED",
    [
      [0, 3, 6],
      [-9, -6, 0],
      [-6, 0, 3],
    ],
  ],
  [
    "AUGMENTED",
    [
      [0, 4, 8],
      [-8, -4, 0],
      [-4, 0, 4],
    ],
  ],
]);

// Temporary, will be a part of settings that are passed to generate chord function eventually
const chord_array = [
  "MAJOR",
  "MAJOR 7",
  "MINOR",
  "MINOR 7",
  "DIMINISHED",
  "AUGMENTED",
];
function CTEmptySheet(score: Score | null, measureCount: number): void {
  if (!score) {
    console.error("Score is null");
    return;
  }
  LoadEmptySheet(score, measureCount);
}
function GenerateChord(
  score: Score | null,
  msrIndex: number = 0,
  beat: number = 1,
): ChordData {
  const cData: ChordData = { SNotes: [], ChordStr: "" };
  if (!score) {
    return cData;
  }
  // Clear the sheet before each chord is generated
  const notes: SinthNote[] = [];
  const noteRangeHigh = 72;
  const noteRangeLow = 60;
  // get root note of chord randomly
  const midiNote =
    Math.floor(Math.random() * (noteRangeHigh - noteRangeLow + 1)) +
    noteRangeLow;
  const chordQuality =
    chord_array[Math.floor(Math.random() * chord_array.length)];
  const voicingArray = CHORDS.get(chordQuality);
  // If we need to change a sharp note to a flat note (to fit a key)
  const accidentalString: string = SharpsOrFlats(midiNote, chordQuality, score);
  const trueRoot = GetTrueRoot(midiNote, accidentalString, score);
  if (!voicingArray) {
    console.error("Chord not found in map");
    return cData;
  }
  const inversionIndx = Math.floor(Math.random() * voicingArray.length);
  const inversion = voicingArray[inversionIndx];
  const invString = GetInversionString(inversionIndx);
  cData.ChordStr = trueRoot + " " + chordQuality + " " + invString;
  inversion.forEach((midiFromRoot) => {
    const sNote: SinthNote = {
      Beat: beat + msrIndex * 4, // this will change when chord progressions are implemented
      Duration: 2,
      MidiNote: midiNote + midiFromRoot,
    };
    notes.push(sNote);
  });
  notes.forEach((n) => {
    AddNote(score, beat, 0.5, n.MidiNote, midiNote, accidentalString, msrIndex);
  });
  cData.SNotes = notes;
  score.ResizeMeasures(score.Sheet.Measures);
  console.log("cData: ", cData);
  return cData;
}

function GetInversionString(invIndex: number): string {
  let invString = "";
  switch (invIndex) {
    case 1:
    case 2:
      invString = "1st Inv.";
      break;
    case 3:
    case 4:
      invString = "2nd Inv.";
      break;
    case 5:
    case 6:
      invString = "3rd Inv.";
      break;
    case 0:
    default:
  }
  return invString;
}

function GetTrueRoot(
  rootMidi: number,
  accString: string,
  score: Score,
): string {
  const rNote = score.PitchMap.get(rootMidi);
  let rootString = "";
  if (rNote === undefined) {
    console.error("Note doesn't exist in pitch map");
    return "Error: Note doesn't exist in pitch map";
  }
  if (rNote.Accidental === 0) {
    // We do not want the 4 in A4 for example, just A
    rootString = rNote.NoteString[0];
  } else if (rNote.Accidental === 1 && accString === "#") {
    rootString = rNote.NoteString[0] + rNote.NoteString[1];
  } else {
    // We need to get a higher midi note and manually add the flat
    // accidental to the root string
    const nextMidi = rootMidi + 1;
    const nNote = score.PitchMap.get(nextMidi);
    if (nNote === undefined) {
      console.error("Next note doesn't exist in pitch map");
      return "Error: Next note doesn't exist in pitch map";
    }
    // Because the accidental is only either 1 or 0, this next note will
    // have no accidental. Meaning we can grab the first character of the
    // NoteString array and append the flat accidental
    rootString = nNote.NoteString[0] + "b";
  }
  return rootString;
}

function AddNote(
  score: Score,
  beat: number,
  duration: number,
  midiNumber: number,
  root: number,
  accidentalString: string,
  msrIndex: number,
): void {
  const pm = score.PitchMap.get(midiNumber);
  const rootNote = score.PitchMap.get(root);
  if (!pm || !rootNote) {
    console.error("Pitchmap midi number not found: ", midiNumber);
    return;
  }
  let accidental = pm.Accidental;
  let line = pm.Line;
  if (accidental === 1) {
    if (accidentalString !== "#") {
      line--;
      accidental = -1;
    }
  }
  const newNote: NoteProps = {
    Beat: beat,
    Duration: duration,
    Line: line,
    Rest: false,
    Tied: false,
    Staff: 0,
    Tuple: false,
    Clef: "treble",
    Editable: false,
  };
  const note: Note = new Note(newNote);
  note.Accidental = accidental;
  score.Sheet.Measures[msrIndex].AddNote(note);
  score.ResizeMeasures(score.Sheet.Measures);
}

function SharpsOrFlats(
  rootNote: number,
  chordQuality: string,
  score: Score,
): string {
  let result = "";
  const rNote = score.PitchMap.get(rootNote);
  if (!rNote) {
    console.error("Pitchmap error for midi Note: ", rootNote);
    return "";
  }
  const noteString =
    rNote.Accidental === 1
      ? rNote.NoteString[0] + rNote.NoteString[1]
      : rNote.NoteString[0];
  switch (chordQuality) {
    case "MAJOR":
    case "MAJOR 7":
    case "AUGMENTED":
      if (noteString === "C") {
        result = "";
      } else {
        const sharpArray = MAJOR.get("#");
        const flatArray = MAJOR.get("b");

        if (!sharpArray || !flatArray) {
          result = "";
          break;
        }
        result = findInAccArray(sharpArray, flatArray, noteString);
      }
      break;
    case "MINOR":
    case "MINOR 7":
    case "DIMINISHED":
      if (noteString === "A") {
        result = "";
      } else {
        const sharpArray = MINOR.get("#");
        const flatArray = MINOR.get("b");

        if (!sharpArray || !flatArray) {
          result = "";
          break;
        }
        result = findInAccArray(sharpArray, flatArray, noteString);
      }
      break;
    default:
  }
  return result;
}

function findInAccArray(
  sharpArray: string[],
  flatArray: string[],
  noteString: string,
): string {
  let result: string = "";
  if (sharpArray.find((s) => s === noteString)) {
    result = "#";
  } else if (flatArray.find((s) => s === noteString)) {
    result = "b";
  } else {
    // I believe this means it is currently a sharp (acc = 1) but should be a flat
    result = "b";
  }
  return result;
}

export { GenerateChord, CTEmptySheet, type ChordData };
