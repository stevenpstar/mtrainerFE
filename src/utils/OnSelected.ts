import { Note, ReturnMidiNumber } from "@/lib/sheet/entry.mjs";
import { Note as SinthNote, Sinth } from "../lib/sinth/main.mjs";

const PlaySelectedNote = (
  note: Note,
  volume: number,
  sample: AudioBuffer,
  context: AudioContext,
) => {
  const midi = ReturnMidiNumber("treble", note.Line, note.Accidental, 0);
  const sNote: SinthNote = {
    Beat: 1,
    Duration: 2,
    MidiNote: midi,
  };
  if (sample) {
    Sinth.playFull(context, sample, 120, volume, [sNote], () => {});
  }
};

export { PlaySelectedNote };
