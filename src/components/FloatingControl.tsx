import { Box, Button, Center, Flex, Icon } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { App as application } from "../lib/sheet/entry.mjs";
interface FloatingControlProps {
  score: application | null;
  top: number;
  left: number;
  textColour: string;
}
function FloatingControl(props: FloatingControlProps) {
  const { score, top, left, textColour } = props;
  const topButtonColour = textColour;
  if (!score) {
  return (<Box>Score not found</Box>)
  }
  return (
      <Box>
        <Box bgColor={'#16191F'} position={'absolute'} top={top} left={left} 
          w='300px'  h='40px' transition={'0.1s'}
           borderRadius={'5px'} boxShadow={'lg'}>
          <Center>
          <Flex justify={'space-evenly'} w='100%'>
      <Button 
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.SetAccidental(-1);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE260'}</Box> Flat </Button>

      <Button
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.SetAccidental(0);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE261'}</Box> Natural</Button>

      <Button
        aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => {
            if (score) {
              score.SetAccidental(1);
            }}
          }
        ><Box className='musicFont' mr={1}>{'\uE262'}</Box> Sharp</Button>

       <Button aria-label='note input mode' border={'0px solid transparent'} variant='ghost' size='sm' color={topButtonColour} 
        leftIcon={<Icon as={AiOutlineDelete} color={'#f08080'} boxSize={5} />}
        _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
        _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
        onClick={() => {
          if (score) {
            score.Delete();
          }}
        }
        >Delete</Button>
        </Flex>
        </Center>
        </Box>
        </Box>
    )
  }

  export { FloatingControl }
