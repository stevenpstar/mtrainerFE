import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';

function MenuDropdown() {
  return (
   <div className='flex items-center justify-center gap-1'>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'
          className='rounded-none hover:text-blue-400 hover:bg-zinc-800 data-[state=on]:border-b-2 
        data-[state=on]:border-[#f08080] data-[state=on]:bg-zinc-900 data-[state=on]:text-zinc-100'
        >
          <DropdownMenuIcon className='h-5 w-5 '/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='rounded-none p-2 min-w-[300px] bg-zinc-950 border-zinc-900 text-zinc-100'>
        <DropdownMenuLabel>Navigation</DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-zinc-800 h-[1px]'/>
        <DropdownMenuItem className='focus:text-zinc-100 focus:bg-zinc-800'>Dashboard</DropdownMenuItem>
        <DropdownMenuItem className='focus:text-zinc-100 focus:bg-zinc-800'>Courses</DropdownMenuItem>
        <DropdownMenuItem className='focus:text-zinc-100 focus:bg-zinc-800'>Practice Tools</DropdownMenuItem>
        <DropdownMenuSeparator className='bg-zinc-800 h-[1px]'/>
        <DropdownMenuItem className='focus:text-zinc-100 focus:bg-zinc-800'>Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  )
}

export { MenuDropdown }
