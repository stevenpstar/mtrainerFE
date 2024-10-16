import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { landingConfig } from "./intervaltrainer/IntervalConfig";
import { SheetStandard } from "@/components/custom/SheetStandard";
import { App as Score } from '../lib/sheet/entry.mjs';
import { AnimateInterval } from "./landing/LandingSheetAnimations";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GiWeightLiftingUp } from "react-icons/gi";

function Home() {

  const score = useRef<Score | null>(null);

  const setScore = (s: Score) => {
    score.current = s;
    score.current.AddStaff(0, "bass");
    score.current.ResizeMeasures(score.current.Sheet.Measures);
    //    score.current.Sheet.Measures[0].Staves.push()
    //    score.current.Sheet.Measures[0].Clefs[1].Type = "bass";
    AnimateInterval(score.current);
  }

  return (
    <div className="landing-page flex flex-col bg-[#0d0d0f] justify-between w-full ">
      <div className="fixed landing_nav w-full h-14 flex flex-row justify-between z-20 bg-[#0A0A0C]">
        <div className="flex flex-row justify-start">
          <div className="p-4 mr-12 text-[#f08080]">Icon</div>
          <div className="p-4">About</div>
          <div className="p-4">How it works</div>
          <div className="p-4">Pricing</div>
        </div>

        <div className="p-4 flex flex-row justify-end gap-6">
          <div>Sign in</div>
        </div>
      </div>
      <div id="hero" className="flex flex-col justify-center w-full h-[800px] bg-[#0A0A0C] z-10">
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
          <div id="hero_img" className="hero_img flex flex-row justify-center w-[50%] h-[500px]">
            <div className="w-[900px]">
              <SheetStandard
                config={landingConfig}
                setParentScore={setScore}
              />
              <div className="absolute right-0 top-0 z-40 coverGrad w-[50px] h-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="features" className="features relative flex flex-col bg-white justify-center w-full text-zinc-900">
        {false && <svg viewBox="0 0 1440 170" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%"
          className="svg-1 absolute transparent">
          <path d="M 0 0 C 480 29 960 29 1440 0" fill="#09090B"></path></svg>
        }

        <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%"
          className="svg-2 absolute transparent z-10">
          <path d="M 0 0 L 1440 0 V 30 C 960 4 480 4 0 30" fill="#09090B"></path></svg>

        <div className="features_anim flex flex-row justify-center">
          <div className="flex flex-row justify-center w-full">
            <div className="w-[50%] bg-white h-[1080px]">
              <div className="relative flex h-full flex-col justify-start mt-16">
                <div className="flex flex-row justify-center w-[100%] mt-12">
                  <Card className="text-left w-[80%] outline-0 shadow-none border-0 mt-12">
                    <CardHeader className="">
                      <CardTitle className="text-5xl flex flex-row gap-2 text-zinc-800"><GiWeightLiftingUp className="w-8 h-8 color-[#f08080]" />Practice Tooling</CardTitle>
                      <CardDescription className="border-b-4 border-[#f08080]">Your daily musical workout</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 justify-start">
                      <ul className="text-xl flex flex-col gap-6">
                        <li className="p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:ml-2">
                          Highly customisable practice tooling to perfect your musical theory and aural skills.
                        </li>
                        <li className="p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:ml-2">
                          Practice all the skills you need, from hearing intervals and chords, to transcribing complex rhythms and melodies - these tools represent your daily musical workout.
                        </li>
                        <li className="p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:ml-2">
                          Results are tracked, giving you powerful insight into both your strengths and weaknesses. Allowing you to practice with greater efficiency.
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-end">
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
            <div className="relative w-[50%] flex flex-col justify-center">
              <div className="flex flex-row justify-center">
                <img className="skew-y-2 w-[90%] hover:mb-6 transition-all duration-300" src="/ptframed.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-12 h-[1080px] bg-[#0d0d0f] w-full text-zinc-200">

        <div className="flex flex-row justify-center w-full">
          <div className="relative w-[50%] flex flex-col justify-center">
            <div className="flex flex-row justify-center">
              <img className="-skew-y-2 w-[90%] hover:mb-6 transition-all duration-300" src="/ptframed.png" />
            </div>
          </div>

          <div className="w-[50%] h-[1080px]">
            <div className="relative flex h-full flex-col justify-start mt-16">
              <div className="flex flex-row justify-center w-[100%] mt-12">
                <Card className="bg-transparent text-left w-[80%] outline-0 shadow-none border-0 mt-12">
                  <CardHeader className="">
                    <CardTitle className="text-5xl flex flex-row gap-2 text-zinc-200 text-right"><GiWeightLiftingUp className="w-8 h-8 color-[#f08080]" />Structured Learning Paths</CardTitle>
                    <CardDescription className="border-b-4 border-[#f08080]">Your daily musical workout</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 justify-start">
                    <ul className="text-xl flex flex-col gap-6">
                      <li className="bg-[#0D0D0F] text-zinc-200 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:ml-2">
                        Highly customisable practice tooling to perfect your musical theory and aural skills.
                      </li>
                      <li className="bg-[#0D0D0F] text-zinc-200 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:ml-2">
                        Practice all the skills you need, from hearing intervals and chords, to transcribing complex rhythms and melodies - these tools represent your daily musical workout.
                      </li>
                      <li className="bg-[#0D0D0F] text-zinc-200 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:ml-2">
                        Results are tracked, giving you powerful insight into both your strengths and weaknesses. Allowing you to practice with greater efficiency.
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex flex-row justify-end">
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center h-[1080px] min-h-[1080px] bg-zinc-200 w-full text-zinc-900">
        <div className="flex flex-row justify-center w-full gap-8">

          <Card className="text-left w-[150px] outline-0 border-0 shadow-none">
            <CardHeader className="bg-zinc-900 text-zinc-200">
              <CardTitle className="text-2xl flex flex-row gap-2">$6.99 Billed Monthly</CardTitle>
              <CardDescription>All prices are in USD</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 justify-start">
            </CardContent>
            <CardFooter>
              Click here for more info
            </CardFooter>
          </Card>

          <Card className="text-left w-[300px] max-w-[300px] outline-0 border-0 shadow-none">
            <CardHeader className="bg-zinc-900 text-zinc-200">
              <CardTitle className="text-2xl flex flex-row gap-2">$60.00 Billed Annually</CardTitle>
              <CardDescription>All prices are in USD</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 justify-start">
            </CardContent>
            <CardFooter>
              Click here for more info
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { Home };

// <svg viewBox="0 0 1440 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" className="absolute top-0 bg-transparent">
// <path d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z" fill="#09090B"></path></svg>
//  /  <svg viewBox="0 0 1440 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" className="absolute top-0 bg-transparent">
//  <path d="M 0 0 H 1445 V 45 Z" fill="#09090B"></path></svg>

