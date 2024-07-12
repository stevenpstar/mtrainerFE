import './App.css'
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, GridItem, Icon, IconButton, Tooltip, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { FaChevronLeft } from 'react-icons/fa';

function App() {

const bgGrad = useColorModeValue('linear(to-t, #313131 0%, #353535 100%)',
  'linear(to-t, black, #121212)');
  const navColour = useColorModeValue('linear(to-b, black, #363636)','linear(to-b, black, #363636)');
//  const inputBgColour = useColorModeValue('linear(to-b, #0e1114, #16191f)', 'black');
  const inputBgColour = useColorModeValue('linear(to-b, #f08080, #ffd6a5)', 'black');
  const navGradient = useColorModeValue('linear(to-b, #16191F, #262B36)', 'black');

  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <Box px={0} w='100%' h='100%' bgColor={'#0e1114'}>
    <Grid
      templateAreas={
      `"nav main" `
      }
       gridTemplateRows={'1fr'}
       gridTemplateColumns={'40px 1fr'}
       h='100%'
       w='100%'
       border={0}
       px={0}
       >
       <GridItem zIndex={1000} area={'nav'} bgGradient={inputBgColour}>
        <Flex 
        direction={'column'}
        gap={4}
        mt='3px'
        ml='7px'>

        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={'#262b36'} 
          leftIcon={<Icon as={RiMenuUnfoldFill} boxSize={6} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => setNavOpen(true)}
          zIndex={1000}
        ></Button>

        </Flex>
        <Drawer placement={'left'} isOpen={navOpen} onClose={() => setNavOpen(false)} size={'xs'}>
          <DrawerOverlay />
          <DrawerContent p={0} bgGradient={navGradient}>
            <DrawerBody p={0} bgGradient={navGradient}>
              <Flex h='100%' w='100%' direction={'row'} justifyContent={'space-between'}>
                <Box>
                </Box>
                <Box>
                </Box>
                <Box h='100%' w='40px' bgGradient={inputBgColour}>
                  <Center>
                  <IconButton 
                    backgroundColor={'transparent'}
                    aria-label='Close Navigation' 
                    _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
                    _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
                    icon={<Icon as={FaChevronLeft} boxSize={4} />} 
                    onClick={() => setNavOpen(false)}
                    />
                  </Center>
                </Box>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </GridItem>
       <GridItem area={'main'} className="gridareamain">
          <Box w='100%' h='100%'>
            <Outlet />
          </Box>
        </GridItem>
    </Grid>
    </Box>
  )
}

export default App


/* old header
 *        <Box w='100%'>
          <Header image=""/>
        </Box>

 * */
