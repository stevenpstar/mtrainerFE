import { PlayIcon, SpeakerModerateIcon, StopIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"

function PlayControls() {
  return (
    <div className='flex items-center justify-center gap-1'>
       <Button variant='ghost' size='icon'
        className='h-9 rounded-none hover:text-blue-400 hover:bg-zinc-800'
       >
        <PlayIcon/>
       </Button>
       <Button variant='ghost' size='icon'
        className=' h-9 rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:bg-zinc-300'
       >
        <StopIcon />
       </Button>

       <Button variant='ghost' size='icon'
        className='h-9 justify-center rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:bg-zinc-300'
       >
        <SpeakerModerateIcon />
       </Button>
      </div>
  )
}

export { PlayControls }
