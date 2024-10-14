import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button";

interface MIProps {
  bits: string[];
  setBits: (bits: string[]) => void;
  submit: () => void;
}

function MultiInput(props: MIProps) {
  const { bits, setBits, submit } = props;
  const [inputVal, setInputVal] = useState<string>("");
  const [inputPadding, setInputPadding] = useState<string>("2px");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selSearchResult, setSelSearchResult] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);

  const bitsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // This will be passed in as a prop eventually for now we are manually setting it here

  const searchData = [
    "A", "Ab", "A#",
    "B", "Bb",
    "C", "Cb", "C#",
    "D", "Db", "D#",
    "E", "Eb",
    "F", "Fb", "F#",
    "G", "Gb", "G#",
    "Major", "Maj",
    "Minor", "Min",
    "Dominant", "Dom",
    "Suspended", "Sus",
    "Diminished", "Dim",
    "Half-Diminished", "Half-Dim", "Half Diminished", "Half Dim",
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
    "1st Inv.", "2nd Inv.", "3rd Inv.",
  ]

  // Unfinished, add as more chords are actually supported
  const searchMap = new Map<string, string>([
    ['a', 'A'], ['ab', 'Ab'], ['a#', 'A#'],
    ['b', 'B'], ['bb', 'Bb'], ['b#', 'B#'],
    ['c', 'C'], ['cb', 'Cb'], ['c#', 'C#'],
    ['d', 'D'], ['db', 'Db'], ['d#', 'D#'],
    ['e', 'E'], ['eb', 'Eb'], ['e#', 'E#'],
    ['f', 'F'], ['fb', 'Fb'], ['f#', 'F#'],
    ['g', 'G'], ['gb', 'Gb'], ['g#', 'G#'],
    ['major', 'Major'], ['maj', 'Major'],
    ['minor', 'Minor'], ['min', 'Minor'],
    ['diminished', 'Diminished'], ['dim', 'Diminished'],
    ['aug', 'Augmented'], ['augmented', 'Augmented'],
    ['7', '7'],
    ['first inv', '1st Inv.'], ['first inv.', '1st Inv.'],
    ['1st inv.', '1st Inv.'], ['first inversion', '1st Inv.'],
    ['1st inversion', '1st Inv.'], ['1st inversion.', '1st Inv.'],
    ['second inv', '2nd Inv.'], ['first inv.', '2nd Inv.'],
    ['2nd inv.', '2nd Inv.'], ['second inversion', '2nd Inv.'],
    ['2nd inversion', '2nd Inv.'], ['2nd inversion.', '2nd Inv.'],
    ['third inv', '3rd Inv.'], ['third inv.', '3rd Inv.'],
    ['3rd inv.', '3rd Inv.'], ['third inversion', '3rd Inv.'],
    ['3rd inversion', '3rd Inv.'], ['3rd inversion.', '3rd Inv.'],

  ])

  const InputChanges = (_e: React.ChangeEvent<HTMLInputElement>) => {
    const str = _e.currentTarget.value.replace(/\s/g, "");
    const iEvent = _e.nativeEvent as InputEvent;
    let curVal: string = '';
    if (iEvent.data === ' ' && searchMap.get(str.toLowerCase())) {
      const newBitsArray: string[] = [...bits];
      const newBitVal = searchMap.get(str.toLowerCase());
      if (newBitVal) {
        newBitsArray.push(newBitVal);
        UpdateBits(newBitsArray);
        setInputVal(_ => '');
      }
    } else {
      setInputVal(_e.currentTarget.value);
      curVal = _e.currentTarget.value;
    }
    if (curVal === '' || curVal === ' ') {
      setSearchResults([]);
    } else {
      setSearchResults(Search(curVal));
    }
    setSelSearchResult(0);
  }

  const Search = (val: string): string[] => {
    return searchData.filter(sd => sd.toLowerCase().includes(val.toLowerCase()));
  }

  const UpdateBits = (bits: string[]): void => {
    setBits(bits);
  }

  const CycleSearchSel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) {
      return;
    }
    const inputLength = inputRef.current.value.length;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (selSearchResult < searchResults.length - 1) {
        setSelSearchResult(selSearchResult => selSearchResult + 1);
      }
      inputRef.current.setSelectionRange(inputLength, inputLength);
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (selSearchResult > 0) {
        setSelSearchResult(selSearchResult => selSearchResult - 1);
      }
      inputRef.current.setSelectionRange(inputLength, inputLength);
    } else if (e.key === 'Enter') {
      if (inputVal === '') {
        submit();
        return;
      }
      const selected = searchResults[selSearchResult];
      const newBits = [...bits]
      // check if res is in search map
      const newBitVal = searchMap.get(selected.toLowerCase());
      if (newBitVal) {
        newBits.push(newBitVal);
        UpdateBits(newBits);
        setInputVal('');
        setSearchResults([]);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else if (e.key === 'Backspace') {
      if (backspaceCount === 1 && inputVal === '') {
        const newBits = [...bits];
        const lastBit = newBits.pop();
        const lastBitVal = lastBit ? lastBit : '';
        UpdateBits(newBits);
        setInputVal(lastBitVal);
        setSearchResults([]);
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setBackspaceCount(0);
      } else {
        if (inputVal === '') {
          setBackspaceCount(1);
        }
      }
    }
    if (e.key !== 'Backspace') {
      // reset backspace counter after other key press
      setBackspaceCount(0);
    }
  }

  useEffect(() => {
    if (bitsRef.current) {
      const r = bitsRef.current;
      const obs = new ResizeObserver(entries =>
        setInputPadding(_ => (entries[0].contentRect.width + 4).toString() + 'px'));
      obs.observe(bitsRef.current);
      return () => obs.unobserve(r);
    }

  }, [])

  return (
    <div className="relative">
      <input
        className={'relative top-o left-0 h-[46px] rounded bg-zinc-200 text-zinc-800'}
        placeholder={bits.length === 0 ? "eg. C# Major 7" : ""}
        value={inputVal}
        style={{ 'paddingLeft': inputPadding, 'minWidth': '400px' }}
        onChange={InputChanges}
        onKeyDown={CycleSearchSel}
        type='text'
        ref={inputRef} />

      <div ref={bitsRef} id='bitsContainer' className='absolute top-0 left-0 flex flex-col z-10 h-[46px] justify-center'>
        <div className='flex flex-row justify-start'>
          {
            bits.map((bit: string, i: number) =>
              <div key={i + bit} className='bg-zinc-800 gap-2 text-zinc-200 rounded ml-1 p-1 flex flex-row'>
                {bit}
                <Button
                  onClick={() => {
                    const nArray = [...bits];
                    nArray.splice(i, 1);
                    UpdateBits(nArray)
                  }}
                  className='p-0 m-0 h-3 w-3 bg-transparent'
                >x</Button>
              </div>
            )
          }
        </div>
      </div>
      <div className='flex flex-row justify-start gap-4 flex-wrap max-w-[400px] mt-4'>
        {
          searchResults.map((res: string, i: number) =>
            <Button
              key={res}
              className={i === selSearchResult ? 'bg-[#caffbf] text-zinc-900 transition-none' :
                'bg-zinc-900 text-zinc-200 transition-none'}
              onClick={() => {
                const newBits = [...bits]
                // check if res is in search map
                const newBitVal = searchMap.get(res.toLowerCase());
                if (newBitVal) {
                  newBits.push(newBitVal);
                  UpdateBits(newBits);
                  setInputVal(_ => '');
                  setSearchResults([]);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }
              }}>
              {res}
            </Button>)
        }
      </div>

    </div>
  )
}

export { MultiInput }
