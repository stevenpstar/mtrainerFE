import { Button } from "../ui/button"

interface TBProps {
  str: string;
  callback: () => void;
  selected: boolean;
  class?: string;
}

function ToolButton(props: TBProps) {
  let c = 'p-5 rounded-none bg-zinc-950 text-zinc-200 min-w[50px] min-h[50px]';
  if (props.class) {
    c = props.class;
  }
  if (props.selected) {
    c += ' bg-zinc-900';
  }
  return (
    <Button className={c}
      onClick={props.callback}
    >
      {props.str}
    </Button>
  )
}

export { ToolButton }
