import { App as Score } from '../lib/sheet/entry.mjs';

type AnimNote = {
  msr: number;
  noteVal: number;
  line: number;
  division: number;
  rest: boolean;
  time: number;
}

function AnimateNoteInput(score: Score, notes: AnimNote[], startTime: number, totalTime: number, timeOut: number): void {
  const currentDiff = new Date().getTime() - startTime;
  if (currentDiff >= totalTime || notes.length === 0) {
    clearTimeout(timeOut);
    return;
  }
  const nextNote = notes[0];
  if (currentDiff >= nextNote.time) {
    score.AddNoteOnMeasure(score.Sheet.Measures[nextNote.msr],
                           nextNote.noteVal,
                           nextNote.line,
                           score.Sheet.Measures[nextNote.msr].Divisions[nextNote.division],
                           false);
    score.ResizeMeasures(score.Sheet.Measures);
    notes.splice(0, 1);
  }
  timeOut = window.setTimeout(() => AnimateNoteInput(score, notes, startTime, totalTime, timeOut), 0.25);
}

export { AnimateNoteInput, type AnimNote }
