import { GearIcon, PlayIcon, SpeakerModerateIcon, StopIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"

interface PCprops {
  play: () => void
  stop: () => void
  setShowSettings: (showSettings: boolean) => void
}

function PlayControls(props: PCprops) {
  return (
    <div className='flex items-center justify-center gap-1'>
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

      <Button variant='ghost' size='icon'
        className='h-9 justify-center rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:bg-zinc-300'
      >
        <SpeakerModerateIcon />
      </Button>

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
