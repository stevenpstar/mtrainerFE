import { Box, Button, Center, Flex, Icon, Input, InputGroup, InputRightElement, Spacer, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { HiSearch, HiUser } from "react-icons/hi";
import { HiMusicalNote } from "react-icons/hi2";

interface HeaderProps {
  image: string;
}
function Header(props: HeaderProps) {
  const bgColour = useColorModeValue('gray.900', 'blackAlpha.700');
  const colour = useColorModeValue('gray.900', 'gray.300')
  const highlightColour = useColorModeValue('pink.500', 'blue.500')

  const inputBgColour = useColorModeValue('linear(to-l, #164066, #0d1f42)', 'black');
  const inputBgColourInverse = useColorModeValue('linear(to-r, #164066, #0d1f42)', 'black');

  return (
    <Box w='100%' px={3} color={colour} zIndex={1000} boxShadow='md' className='header' pos={'relative'} bgColor={'#212121'}>
      <Flex w='100%' h={'50px'} alignItems={'center'} justifyContent={'space-between'}>
        <Box color={highlightColour} fontSize={'0.9em'}> 
        </Box>
        <Box h='100%'>
        <Center h='100%'>
        <Flex w='100%' alignItems={'flex-end'} justifyContent={'start'} gap='6' fontSize={'0.8em'}>
          <Icon as={HiUser} boxSize={5}  color={'gray.400'}/>
        </Flex>
        </Center>
        </Box>
      </Flex>
    </Box>
  )
}

export { Header }

// button bgColor 12484C
// input bgcolor 333C3E
