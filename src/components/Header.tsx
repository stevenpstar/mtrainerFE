import { Box, Center, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { HiUser } from "react-icons/hi";

function Header() {
  const colour = useColorModeValue('gray.900', 'gray.300')
  const highlightColour = useColorModeValue('pink.500', 'blue.500')

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
