import './App.css'
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className='flex flex-col h-svh'>
      <div className='bg-zinc-50 grow heey w-full'>
        <Outlet />
      </div>
    </div>
  )
}

export default App

