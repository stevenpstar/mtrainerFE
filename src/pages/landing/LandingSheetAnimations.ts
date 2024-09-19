import { AnimNote, AnimateNoteInput } from "@/utils/ScoreAnimator";
import { App as Score } from "../../lib/sheet/entry.mjs";
function AnimateInterval(score: Score): void {
  const rate = 400;
  score.AddMeasure();
  score.AddMeasure();
  const testNotes: AnimNote[] = [
    {
      msr: 0,
      noteVal: 0.25,
      line: 16,
      division: 0,
      rest: false,
      time: 1 * rate,
    },
    {
      msr: 0,
      noteVal: 0.25,
      line: 14,
      division: 1,
      rest: false,
      time: 2 * rate,
    },
    {
      msr: 0,
      noteVal: 0.5,
      line: 14,
      division: 2,
      rest: false,
      time: 3 * rate,
    },
    {
      msr: 0,
      noteVal: 0.5,
      line: 16,
      division: 2,
      rest: false,
      time: 4 * rate,
    },
    {
      msr: 1,
      noteVal: 0.5,
      line: 14,
      division: 0,
      rest: false,
      time: 5 * rate,
    },
    {
      msr: 1,
      noteVal: 0.5,
      line: 16,
      division: 0,
      rest: false,
      time: 6 * rate,
    },
    {
      msr: 1,
      noteVal: 0.25,
      line: 14,
      division: 1,
      rest: false,
      time: 7 * rate,
    },
    {
      msr: 1,
      noteVal: 0.25,
      line: 16,
      division: 2,
      rest: false,
      time: 8 * rate,
    },
    {
      msr: 2,
      noteVal: 0.125,
      line: 20,
      division: 0,
      rest: false,
      time: 9 * rate,
    },
    {
      msr: 2,
      noteVal: 0.125,
      line: 18,
      division: 1,
      rest: false,
      time: 10 * rate,
    },
    {
      msr: 2,
      noteVal: 0.125,
      line: 16,
      division: 2,
      rest: false,
      time: 11 * rate,
    },
    {
      msr: 2,
      noteVal: 0.125,
      line: 13,
      division: 3,
      rest: false,
      time: 12 * rate,
    },
  ];

  AnimateNoteInput(score, testNotes, new Date().getTime(), 13 * rate, 0);
}

export { AnimateInterval };
