type PathNodeProps = {
  Label: string;
  Link: string;
  Spacer: boolean;
}

function PathNodeElem(props: PathNodeProps) {
  const { Label, Link, Spacer } = props;
  if (!Spacer) {
    return <div>
      <div
        className="w-48 h-16 p-2 border-2 rounded-2xl border-zinc-900 text-zinc-200 flex flex-col justify-center shadow-md hover:border-zinc-800 hover:shadow-xl transition-all duration-300 hover:cursor-pointer">
        <div className="flex flex-row justify-center gap-4">
          <a href={Link}>{Label}</a>
        </div>
        <div className="">0/5</div>
      </div>
    </div>
  }
  return <div className="w-48 h-16 p-2"></div>
}

export { PathNodeElem }
