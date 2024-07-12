import { NoteProps, App as application, Note, MappedMidi } from '../lib/sheet/entry.mjs';
import { type Note as SinthNote} from '../lib/sinth/main.mjs';
import { IntSettings } from '../pages/IntervalTrainer';
const baseIntervalLoad = '{"Measures":[{"Clef":"treble","TimeSignature":{"Selected":false,"SelType":3,"top":2,"bottom":4,"Editable":true,"TopPosition":{"x":35,"y":37.5},"BotPosition":{"x":35,"y":57.5},"GTopPosition":{"x":35,"y":132.5},"GBotPosition":{"x":35,"y":152.5},"Bounds":{"x":35,"y":27.5,"width":30,"height":50},"GBounds":{"x":35,"y":122.5,"width":30,"height":50}},"Notes":[],"Bounds":{"x":0,"y":-2.5,"width":150,"height":95},"ShowClef":true,"ShowTime":true}]}';

type Interval = {
  notes: SinthNote[];
  name: string;
}

const intMap= new Map<number, string>([
  [0, 'Unison'],
  [1, 'min2'],
  [2, 'Maj2'],
  [3, 'min3'],
  [4, 'Maj3'],
  [5, 'P4'],
  [6, 'Aug4/Dim5'],
  [7, 'P5'],
  [8, 'min6'],
  [9, 'Maj6'],
  [10, 'min7'],
  [11, 'Maj7'],
  [12, 'Oct'],
]);

function CreateIntervalArray(settings: IntSettings): number[] {
  const intArray: number[] = [];
  if (settings.Unison)
    intArray.push(0);
  if (settings.min2)
    intArray.push(1);
  if (settings.Maj2)
    intArray.push(2);
  if (settings.min3)
    intArray.push(3);
  if (settings.Maj3)
    intArray.push(4);
  if (settings.P4)
    intArray.push(5);
  if (settings.Aug4Dim5)
    intArray.push(6);
  if (settings.P5)
    intArray.push(7);
  if (settings.min6)
    intArray.push(8);
  if (settings.Maj6)
    intArray.push(9);
  if (settings.min7)
    intArray.push(10);
  if (settings.Maj7)
    intArray.push(11);
  if (settings.Oct)
    intArray.push(12);

  return intArray;
}

function GenerateNewIntervals(count: number, app: application, settings: IntSettings): Interval {
  
  // Using count to remove error!
  count++;
  //
  const pitchMap = app.PitchMap;
  const noteDuration = 2;
  const sinthNotes: SinthNote[] = [];
  app.LoadSheet(baseIntervalLoad);

  const intArray = CreateIntervalArray(settings);

  const midiNote = Math.floor(Math.random() * (72 - 60 + 1)) + 60; // starting note
  const midiDiff = intArray[Math.floor(Math.random() * intArray.length)]
  const midiNote2 = Math.floor(Math.random() * 2) === 0 ? midiNote + midiDiff : midiNote - midiDiff;

  const diff = midiNote > midiNote2 ? midiNote - midiNote2 : midiNote2 - midiNote;

  let getLine1 = 0;
  let getLine2 = 0;

  const map1 = pitchMap.get(midiNote);
  const map2 = pitchMap.get(midiNote2);
  if (map1) {
    getLine1 = map1.Line;
  }
  if (map2) {
    getLine2 = map2.Line;
  }

  const sNote1: SinthNote = {
    Beat: 1,
    Duration: noteDuration,
    MidiNote: midiNote,
  }

  const sNote2: SinthNote = {
    Beat: 1,
    Duration: noteDuration,
    MidiNote: midiNote2,
  }
  sinthNotes.push(sNote1);
  sinthNotes.push(sNote2);

  const note: NoteProps = {
    Beat: 1,
    Duration: 0.5,
    Line: getLine1,
    Rest: false,
    Tied: false,
    Staff: 0,
    Tuple: false,
    Clef: "treble",
    Editable: false,
  }

  const n1 = new Note(note);
  n1.Accidental = map1?.Accidental ? map1.Accidental : 0;

  const note2: NoteProps = {
    Beat: 1,
    Duration: 0.5,
    Line: getLine2,
    Rest: false,
    Tied: false,
    Staff: 0,
    Tuple: false,
    Clef: "treble",
    Editable: false,
  }

  const n2 = new Note(note2);
  n2.Accidental = map2?.Accidental ? map2.Accidental : 0;

  if (settings.NotateCount >= 1) {
    app.Sheet.Measures[0].AddNote(n1)
  } 
  if (settings.NotateCount >= 2) {
    app.Sheet.Measures[0].AddNote(n2)
  }
  app.ResizeMeasures(app.Sheet.Measures);

  let intName = "";
  if (intMap.get(diff)) {
    intName = intMap.get(diff) as string;
  }

  const interval: Interval = {
    notes: sinthNotes,
    name: intName,
  }

  return interval;
}

// Test function
function GetMidiFromLine(line: number, acc: number, pitchmap: Map<number, MappedMidi> | undefined): number {
  if (!pitchmap) { 
    console.error("No pitch map found");
    return -1; }
  for (const [key, value] of pitchmap.entries()) {
    if (value.Line === line && value.Accidental === acc) {
      return key;
    }
  }
  console.error("Not found!");
  return -1;
}

export { baseIntervalLoad, GenerateNewIntervals, GetMidiFromLine, intMap }

