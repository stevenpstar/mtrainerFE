import { Note, NoteProps, ReturnLineFromMidi, App as Score } from '../../lib/sheet/entry.mjs'
import { LoadEmptySheet } from '../rhythmreading/RGenerator'
import { Note as SinthNote } from '../../lib/sinth/main.mjs';

// Define chords

const CHORDS = new Map<string, Array<number[]>>(
  [
    ["MAJOR", [[0, 4, 7]]],
    ["MINOR", [[0, 3, 7]]],
  ]
)

// Temporary, will be a part of settings that are passed to generate chord function eventually
const chord_array = [ "MAJOR", "MINOR" ];

function GenerateChord(score: Score): SinthNote[] {
  // Clear the sheet before each chord is generated
  LoadEmptySheet(score, 1);
  const notes: SinthNote[] = [];
  const noteRangeHigh = 72;
  const noteRangeLow = 60;
  // get root note of chord randomly
  const midiNote = Math.floor(Math.random() * (noteRangeHigh - noteRangeLow + 1)) + noteRangeLow;
  const chordQuality = chord_array[Math.floor(Math.random() * chord_array.length)];
  const voicingArray = CHORDS.get(chordQuality);
  if (!voicingArray) {
    console.error("Chord not found in map");
    return notes;
  }
  const inversion = voicingArray[Math.floor(Math.random() * voicingArray.length)];
  inversion.forEach(midiFromRoot => {
    console.log("midiFromRoot: ", midiFromRoot);
    const sNote: SinthNote = {
      Beat: 1, // this will change when chord progressions are implemented
      Duration: 2,
      MidiNote: midiNote + midiFromRoot
    };
    notes.push(sNote);
  })
  notes.forEach(n => {
    AddNote(score, 1, 2, n.MidiNote);
  })
  console.log(notes);
  return notes;
}

function AddNote(score: Score, beat: number, duration: number, midiNumber: number): void {
//  const line = ReturnLineFromMidi("treble", midiNumber, 0); 
  const pm = score.PitchMap.get(midiNumber);
  if (!pm) {
    console.error("Pitchmap midi number not found: ", midiNumber);
    return;
  }
  const line = pm.Line;
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
  }

  score.Sheet.Measures[0].AddNote(new Note(newNote));
  score.ResizeMeasures(score.Sheet.Measures);
}

export { GenerateChord }
