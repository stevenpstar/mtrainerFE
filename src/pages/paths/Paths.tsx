import { Input } from "@/components/ui/input"
/* Kind of a stub/temp/partial implementation so far */
function Paths() {
  return (
    <div className="flex flex-col justify-start w-full h-full bg-zinc-950 text-zinc-200">
      <div className="w-full h-14 bg-zinc-950 flex flex-row justify-between">
        <div></div>
        <div className="h-full flex flex-col justify-center w-64">
          <Input className="outline-0 border-0 bg-zinc-900 w-full h-8 rounded-xl" />
        </div>
        <div></div>
      </div>
      <div className="w-full h-14 bg-zinc-950 mb-12">
        <h2 className="text-5xl">Learning Pathways</h2>
      </div>
      <ul className="flex flex-col justify-start">
        <li className="p-8 text-xl bg-[#0d0d0f]">Fundamentals</li>
        <li className="p-8 text-xl bg-[#0d0d0g]">Beginner</li>
        <li className="p-8 text-xl bg-[#0d0d0f]">Intermediate</li>
        <li className="p-8 text-xl bg-[#0d0d0g]">Advanced</li>
      </ul>
    </div>
  )
}

export { Paths }
