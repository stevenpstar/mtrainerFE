import { Button } from "@chakra-ui/react";

//a = answer string
//d = display string
interface ITButtonProps {
  d: string;
  a: string;
  setInterval: (a: string) => void,
  getButtonColour: (a: string) => string
}
function ITButton (props: ITButtonProps) {
  const { d, a, setInterval, getButtonColour } = props;
  return (
    <Button 
      size='sm'
      variant='ghost'
      border={0}
      onClick={() => setInterval(a)}
      _hover={{ backgroundColor: 'transparent', color: 'white', outline: '0', border: '0'}}
      _focus={{ color: '#ffda60' , backgroundColor: 'transparent', border: '0', outline: '0'}}
      color={getButtonColour(a)}>{d}</Button>
  )
}

export { ITButton }
