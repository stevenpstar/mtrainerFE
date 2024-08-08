import { AnimNote, AnimateNoteInput } from '@/utils/ScoreAnimator';
import { App as Score } from '../../lib/sheet/entry.mjs';
function AnimateInterval(score: Score): void {
    score.AddMeasure();
    const testNotes: AnimNote[] = [
      {
        msr: 0, noteVal: 0.25, line: 16, division: 0, rest: false, time: 500
      },
      {
        msr: 0, noteVal: 0.25, line: 14, division: 1, rest: false, time: 1000
      },
      {
        msr: 0, noteVal: 0.5, line: 14, division: 2, rest: false, time: 1500
      },
      {
        msr: 0, noteVal: 0.5, line: 16, division: 2, rest: false, time: 1500
      },
     {
        msr: 1, noteVal: 0.5, line: 14, division: 0, rest: false, time: 2500
      },
      {
        msr: 1, noteVal: 0.5, line: 16, division: 0, rest: false, time: 2500
      },
      {
        msr: 1, noteVal: 0.25, line: 14, division: 1, rest: false, time: 3000
      },
      {
        msr: 1, noteVal: 0.25, line: 16, division: 2, rest: false, time: 3500
      },

    ];

    AnimateNoteInput(score, 
      testNotes,
      new Date().getTime(),
      4000,
      0);
}

export { AnimateInterval }

