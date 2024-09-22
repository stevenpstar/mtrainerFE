import { GearIcon, PlayIcon, SpeakerModerateIcon, StopIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"
import { useState } from "react"
import { Slider } from "../ui/slider"

interface PCprops {
  play: () => void
  stop: () => void
  setShowSettings: (showSettings: boolean) => void
  setParentVolume: (volume: number) => void
}

function PlayControls(props: PCprops) {
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);

  const UpdateVolume = (vol: number) => {
    setVolume(vol);
    props.setParentVolume(vol);
  }

  return (
    <div className='flex items-center justify-start gap-1 grow max-w-[500px]'>
      <Button variant='ghost' size='icon'
        className='h-9 rounded-none hover:text-blue-400 hover:bg-zinc-800'
        onClick={props.play}
      >
        <PlayIcon />
      </Button>
      <Button variant='ghost' size='icon'
        className=' h-9 rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:bg-zinc-300'
        onClick={props.stop}
      >
        <StopIcon />
      </Button>

      <Button
        variant='ghost'
        size='icon'
        onClick={() => setShowVolume(showVolume => !showVolume)}
        className='h-9 justify-center rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:bg-zinc-300'
      >
        <SpeakerModerateIcon />
      </Button>

      {showVolume &&
        <Slider
          defaultValue={[volume]}
          max={100}
          step={1}
          orientation="horizontal"
          className="max-w-[200px]"
          onValueCommit={(e) => UpdateVolume(e[0])}
        />
      }

      <Button
        value="settings"
        className="h-9 bg-grey-900 justify-center rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:bg-zinc-300"
        variant="default"
        onClick={() => props.setShowSettings(true)}>
        <GearIcon className="h-4 w-4" />
      </Button>

    </div>
  )
}

export { PlayControls }
