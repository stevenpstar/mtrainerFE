import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { landingConfig } from "./intervaltrainer/IntervalConfig";
import { SheetStandard } from "@/components/custom/SheetStandard";
import { App as Score } from '../lib/sheet/entry.mjs';
import { AnimateInterval } from "./landing/LandingSheetAnimations";
import { ArrowRightIcon, ArrowUpIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";

function Home() {

  const [selFeature, setSelectedFeature] = useState<number>(0);
  const score = useRef<Score | null>(null);

  const practiceTools = [
    "Chord Practice Tool",
    "Interval Practice Tool",
    "Rhythmic and Melodic Transcription",
    "Rhythmic and Melodic Sight Reading",
    "Scale and Modes Practice Tool",
    "Relative and Perfect Pitch"
  ]

  const pToolClass = "p-3 border-l-4 shadow-md hover:cursor-pointer hover:bg-zinc-900 hover:text-zinc-200 flex flex-row justify-between";

  const addScrollCSS = () => {
    const maxScrollHeight = document.body.scrollHeight - window.innerHeight;
    document.body.style.setProperty('--scroll',
      (window.scrollY / maxScrollHeight).toString())
  }

  const setScore = (s: Score) => {
    score.current = s;
    AnimateInterval(score.current);
  }

  useEffect(() => {
    window.addEventListener('scroll', addScrollCSS, false);
    return () => window.removeEventListener('scroll', addScrollCSS);
  }, [])

  return (
    <div className="flex flex-col bg-[#0d0d0f] justify-between w-full ">
      <div className="fixed landing_nav w-full h-14 flex flex-row justify-between z-20">
        <div className="p-4">Icon</div>
        <div className="p-4 flex flex-row justify-end gap-6">
          <div>About</div>
          <div>How it works</div>
          <div>Pricing</div>
          <div>Sign in</div>
        </div>
      </div>
      <div id="hero" className="flex flex-col justify-center w-full h-[800px] bg-gradient-to-b from-[#0d0d0f] to-zinc-950 z-10">
        <div className="flex flex-row justify-evenly">
          <div id="hero_text" className="flex flex-row justify-center text-left w-[50%] text-zinc-200">
            <div className='flex flex-col gap-4 justify-center'>
              <h1 className="text-5xl max-w-[95%] ml-20">Become a better musician by
                <span className="text-[#f08080]"> mastering the fundamentals</span></h1>
              <h2 className='ml-20 text-xl'>Understand exactly what you hear</h2>
              <div className="flex flex-row justify-start gap-2">
                <Button className="bg-zinc-900 w-36 text-md ml-20 font-bold" size="lg">Try for free</Button>
                <Button variant={"link"} className="text-[#f08080] text-md font-bold">Find out more
                  <ArrowRightIcon className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
          <div id="hero_img" className="hero_img flex flex-row justify-center w-[50%]">
            <div className="w-36 h-36 bg-[#f08080]"></div>
          </div>
        </div>
      </div>
      <div id="features" className="features relative flex flex-col bg-zinc-100 justify-center w-full h-svh max-h-[1080px] text-zinc-900">
        <svg viewBox="0 0 1440 170" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%"
          className="svg-1 absolute transparent">
          <path d="M 0 0 C 480 29 960 29 1440 0" fill="#09090B"></path></svg>

        <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%"
          className="svg-2 absolute transparent z-10">
          <path d="M 0 0 L 1440 0 V 30 C 960 4 480 4 0 30" fill="#09090B"></path></svg>

        <div className="features_anim flex flex-row justify-center h-full">
          <div className="flex flex-row justify-center w-[50%] h-full">
            <div className="flex flex-col justify-start h-full w-[80%] mt-12 ">
              <div
                className="min-w-128 max-w-164 min-h-24 text-left p-4">
                <h2 className="border-l-4 border-[#f08080] text-3xl text-zinc-100 bg-zinc-900 shadow-md font-bold mt-12 p-4 flex flex-row">
                  Powerful Practice Tools</h2>
                <p className="border-l-4 border-[#f08080] font-medium bg-zinc-800 shadow-md text-zinc-100 p-4">Highly configurable practice tools designed to test and improve your aural, theory and transcription skills through daily repetition and logical progression.</p>
                <div className="flex flex-col justify-start mt-8">
                  <ul className="flex flex-col gap-2">
                    {
                      practiceTools.map((t: string, i: number) =>
                        <li
                          onClick={() => setSelectedFeature(i)}
                          style={{ "borderColor": selFeature === i ? "#f08080" : "transparent" }}
                          className={selFeature === i ? "bg-zinc-900 text-zinc-100 " + pToolClass :
                            i % 2 === 0 ? "bg-white " + pToolClass : "bg-zinc-100 " + pToolClass}>
                          {t}
                          <ChevronRightIcon className='w-6 h-6' />
                        </li>)
                    }
                    <li className="bg-zinc-900 p-3 text-zinc-100 border-b-2 shadow-md flex flex-row justify-center gap-2">
                      Click a tool for more information <ArrowUpIcon className="w-4 h-4" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[50%] bg-[#fff] flex flex-row justify-center">
            {selFeature === 1 &&
              <div className="h-[30%] w-[85%]">
                <h2 className="text-xl font-bold text-left ml-8 mt-28 text-zinc-100 bg-zinc-900 mr-8 p-4 shadow-md">Interval Practice Tool</h2>
                <div className="z-40 text-left ml-8 mr-8 bg-zinc-800 text-zinc-200 p-4 shadow-md">
                  In music, an interval is the distance between two notes.
                  Intervals are the fundamental building blocks for chords and scales.
                  Our tool will help you identify and notate intervals from a unison interval to an octave.
                </div>

                <SheetStandard
                  config={landingConfig}
                  setParentScore={setScore}
                />
                <div className="flex flex-row justify-center mb-4">
                  <Separator className="w-[90%] h-[1px] bg-zinc-200" />
                </div>
                <div className="z-40 text-left ml-8 mt-2 bg-zinc-900 text-zinc-100 mr-8 p-4 shadow-md">
                  <p>Our tool covers...</p>
                  <ul className="list-disc ml-8 mt-2">
                    <li>Unison to Octave intervals</li>
                    <li>Configurable progression of difficulty</li>
                    <li>Variety of ways to practice</li>
                    <li>Tracks your results for targeted high quality practice</li>
                  </ul>
                </div>

              </div>
            }
          </div>
        </div>

      </div>
      <div className="flex flex-col h-[1080px] bg-[#0d0d0f] w-full">
        heyeye
      </div>
    </div>
  )
}

export { Home };

// <svg viewBox="0 0 1440 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" className="absolute top-0 bg-transparent">
// <path d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z" fill="#09090B"></path></svg>
//  /  <svg viewBox="0 0 1440 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" className="absolute top-0 bg-transparent">
//  <path d="M 0 0 H 1445 V 45 Z" fill="#09090B"></path></svg>

