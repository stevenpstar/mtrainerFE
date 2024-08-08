import { MenuDropdown } from "@/components/custom/MenuDropdown"

function Analytics () {
  
  return (
    <div className='flex flex-col justify-start bg-zinc-950 w-full h-full'>
      <div className='flex flex-row justify-between bg-[#0d0d0f] border-b border-zinc-900 h-12 w-full overflow-hidden'>
        <MenuDropdown />
        <div className='flex flex-col justify-center h-full pr-4'>
          <div className='rounded-full w-6 h-6 bg-blue-100'></div>
        </div>
      </div>

      <div className='flex flex-row justify-start h-full w-full'>
        <div id="NavBar" className='flex flex-col w-72 h-full justify-start bg-zinc-950 border-r border-[#0d0d0f]'>
          <ul className='text-left p-2 text-zinc-200'>
            <li className='p-2'>Interval Trainer</li>
            <li className='p-2'>Chord Trainer</li>
          </ul>
        </div>
        <div id="AnalyticsContent" className='flex flex-col justify-start gap-8 grow bg-zinc-950'>
          <div className='flex flex-row justify-center'>
            <div className='flex flex-row justify-start rounded gap-2 h-24 mt-8 w-[90%] bg-zinc-900'>
            </div>
          </div>
          <div className='flex flex-row justify-center'>
            <div className='flex flex-row justify-start rounded gap-2 h-64 w-[90%] bg-[#0d0d0f] border-2 border-zinc-900'>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Analytics }
