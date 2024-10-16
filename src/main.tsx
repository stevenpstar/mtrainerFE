import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard.tsx'
import { ProtectedComponent } from './utils/ProtectedComponent.tsx'
import { Login } from './pages/Login.tsx'
import { Lesson } from './pages/Lesson.tsx'
import { IntervalTrainer } from './pages/IntervalTrainer.tsx'
import { RhythmReading } from './pages/RhythmReading.tsx'
import { RhythmTranscription } from './pages/RhythmTranscription.tsx'
import { ScaleNotate } from './pages/ScaleNotating.tsx'
import { Landing } from './Landing.tsx'
import { Practice } from './pages/Practice.tsx'
import { ChordTrainer } from './pages/ChordTrainer/ChordTrainer.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { Analytics } from './pages/Analytics.tsx'
import { Paths } from './pages/paths/Paths.tsx'
import { FundamentalsTree } from './pages/paths/FundamentalsTree.tsx'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Titillium Web', sans-serif`,
    body: `'Titillium Web', sans-serif`,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "practice",
        element: <Practice />
      },
      {
        path: "analytics",
        element: <Analytics />
      },
      {
        path: "dashboard",
        element: <ProtectedComponent><Dashboard /></ProtectedComponent>
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "pathways",
        element: <Paths />
      },
      {
        path: "pathways/fundamentals",
        element: <FundamentalsTree />
      },
      {
        path: "courses/:lesson/:id",
        element: <Lesson />
      },
      {
        path: "practice/intervals",
        element: <IntervalTrainer />,
      },
      {
        path: "practice/rhythm-reading",
        element: <RhythmReading />,
      },
      {
        path: "practice/rhythm-transcription",
        element: <RhythmTranscription />,
      },
      {
        path: "practice/notate-scale",
        element: <ScaleNotate />,
      },
      {
        path: "practice/chords",
        element: <ChordTrainer />,
      },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="579128989771-goqn01qifeiqi3014etchrhspp177u2c.apps.googleusercontent.com">
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={'light'} />
        <RouterProvider router={router}>
        </RouterProvider>
        <Toaster />
      </ChakraProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
