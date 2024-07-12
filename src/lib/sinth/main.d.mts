declare namespace Sinth {
    function CreateSinth(): void;
    function play(sound: AudioBuffer, tempo: number, callback: () => void): void;
    function playFull(sound: AudioBuffer, tempo: number, notes: Note[], callback: () => void): void;
    function playMetronome(count: number, tempo: number): void;
    function stop(): void;
    function initplay(notes: Note[]): void;
}
interface Note {
    Beat: number;
    Duration: number;
    MidiNote: number;
}

export { type Note, Sinth };
