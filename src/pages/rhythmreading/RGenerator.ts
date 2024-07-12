import { Note, NoteProps, App as application } from "../../lib/sheet/entry.mjs"
import { Note as SinthNote} from "../../lib/sinth/main.mjs";

const baseIntervalLoad = '{"Measures":[{"Clef":"treble","TimeSignature":{"Selected":false,"SelType":3,"top":4,"bottom":4,"Editable":true,"TopPosition":{"x":35,"y":37.5},"BotPosition":{"x":35,"y":57.5},"GTopPosition":{"x":35,"y":132.5},"GBotPosition":{"x":35,"y":152.5},"Bounds":{"x":35,"y":27.5,"width":30,"height":50},"GBounds":{"x":35,"y":122.5,"width":30,"height":50}},"Notes":[],"Bounds":{"x":0,"y":-2.5,"width":150,"height":95},"ShowClef":false,"ShowTime":true}]}';

// Prototyping beat combinations
const combinations = [
  //[1],
  //[0.5],
  [0.25],
//  [0.125, 0.125],
//  [0.125, 0.0625, 0.0625],
//  [0.0625, 0.0625, 0.125],
//  [0.0625, 0.0625, 0.0625, 0.0625]
]

function LoadEmptySheet(app: application, measureCount: number): void {
  app.LoadSheet(baseIntervalLoad);
  for (let m=0;m<measureCount-1;m++) {
    app.AddMeasure();
  }
  app.ResizeMeasures(app.Sheet.Measures);
}

function GenerateHiddenRhythm(app: application): SinthNote[] {
  const sNoteArray: SinthNote[] = [];

  app.Sheet.Measures.forEach((m, i) => {
    const beats = m.TimeSignature.bottom;
    const chosenCombinations = [];
    let beat = 1 + (m.TimeSignature.bottom * i); // starting at 5 as first four beats will be metronome count in
    const restChance = 8;
    for (let b=0;b<beats;b++) {
      chosenCombinations.push(combinations[Math.floor(Math.random() * combinations.length)]);
    }
    chosenCombinations.forEach(combo => {
      combo.forEach(c => {
        const isRest = Math.floor(Math.random() * restChance) === 0 ? true : false;
        const val = c * m.TimeSignature.bottom;
        if (!isRest) {
          const sNote: SinthNote = {
            Beat: beat + 4,
            Duration: val,
            MidiNote: 69,
          };
          sNoteArray.push(sNote);
        }
        beat += val;
      });
    })
  });

  return sNoteArray;
}

function CompareTranscription(app: application, sNoteArray: SinthNote[]): boolean {
  let correct = true;
  
  sNoteArray.forEach((n: SinthNote) => {
    // TODO: Currently hard coded to 4, assuming all transcriptions are in 4/4 for now
    const msrIndx = Math.floor((n.Beat - 5) / 4);
    // subtract four to account for the metronome
    const beat = n.Beat - (msrIndx * 4) - 4;
    if (app.Sheet.Measures[msrIndx] === null || app.Sheet.Measures[msrIndx] === undefined) {
      correct = false;
      console.error("No measure found");
      return;
    }
    const findDivision = app.Sheet.Measures[msrIndx].Divisions.filter(
      d => d.Beat === beat)
    if (findDivision.length === 0) {
      correct = false;
    }
    const findNote = app.Sheet.Measures[msrIndx].Notes.filter((n: Note) => n.Beat === beat)
    if (findNote.length === 0) {
      correct = false;
    } else if (findNote[0].Rest) {
      correct = false;
    }
  });
  console.log("Answer is: ", correct);
  return correct;
}

function GenerateRhythm(app: application, tempo: number = 100) {
  const beatArray: number[] = [];
  const bps = 60 / tempo; /// beat === crotchet or 0.25
  app.LoadSheet(baseIntervalLoad);
  app.AddMeasure();
  app.AddMeasure();
  app.AddMeasure();
  app.AddMeasure();
  app.AddMeasure();
  app.AddMeasure();
  app.AddMeasure();

  app.ResizeMeasures(app.Sheet.Measures);
  app.Sheet.Measures.forEach((m, i) => {
    const startingVal = i * ((bps * m.TimeSignature.bottom) * 1000);
    let runningVal = startingVal;
    const beats = m.TimeSignature.bottom;
    const chosenCombinations = [];
    let beat = 1;
    const restChance = 8; //( 1 in x)
    for (let b=0;b<beats;b++) {
      chosenCombinations.push(combinations[Math.floor(Math.random() * combinations.length)]);
    }
    chosenCombinations.forEach(combo => {
      combo.forEach(noteValue => {
        const isRest = Math.floor(Math.random() * restChance) === 0 ? true : false;
        const note: NoteProps = {
          Beat: beat,
          Duration: noteValue,
          Line: 15,
          Rest: isRest,
          Tied: false,
          Staff: 0,
          Tuple: false,
          Clef: "treble",
          Editable: false,
        }
        const Divisions = m.Divisions.filter(d => d.Beat === beat);

        if (Divisions.length === 0) {
          return;
        }

        if (noteValue > Divisions[0].Duration && Divisions[0].Beat % 1 !== 0) {
          noteValue = Divisions[0].Duration;
          if (noteValue === 0) { console.error("Note value 0 at division check"); }
        }
        app.AddNoteOnMeasure(m, note.Duration, 15, Divisions[0], note.Rest);
        if (!note.Rest) {
          beatArray.push(runningVal);
        }
        beat += (noteValue * m.TimeSignature.bottom);
        runningVal = startingVal + ((beat - 1) * bps * 1000);
      })
    })
  });
  app.ResizeMeasures(app.Sheet.Measures);
  return beatArray;
}

export { GenerateRhythm, LoadEmptySheet, GenerateHiddenRhythm, CompareTranscription }
