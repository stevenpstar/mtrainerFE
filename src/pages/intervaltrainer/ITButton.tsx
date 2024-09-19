//a = answer string

import { Button } from "@/components/ui/button";

//d = display string
interface ITButtonProps {
  d: string;
  a: string;
  setInterval: (a: string) => void,
  getButtonColour: (a: string) => string
}

function gbc(colour: string): string {
  // tailwind bs
  const orange = "font-sans bg-transparent outline-0 border-0 hover:bg-transparent text-orange-300";
  const green = "font-sans bg-transparent outline-0 border-0 hover:bg-transparent text-green-300";
  const selected = "font-sans bg-transparent outline-0 border-0 hover:bg-transparent text-blue-300";
  const transp = "font-sans bg-transparent outline-0 border-0 hover:bg-transparent text-transparent";
  const gray = "font-sans bg-transparent outline-0 border-0 hover:bg-transparent text-gray-300";

  switch (colour) {
    case "gray-300":
      return gray;
    case "green-300":
      return green;
    case "transparent":
      return transp;
    case "blue-300":
      return selected;
    case "orange-300":
      return orange;
    default:
      return gray;
  }
}

function ITButton(props: ITButtonProps) {
  const { d, a, setInterval, getButtonColour } = props;
  return (
    <Button
      size='sm'
      variant='ghost'
      className={gbc(getButtonColour(a))}
      onClick={() => setInterval(a)}>{d}</Button>
  )
}

export { ITButton }
