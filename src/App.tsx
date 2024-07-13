import './App.css'
import { Box, Button, Center, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Grid, GridItem, Icon, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

function App() {
  const inputBgColour = useColorModeValue('linear(to-b, #f08080, #ffd6a5)', 'black');
  const navGradient = useColorModeValue('linear(to-b, #16191F, #262B36)', 'black');

  const [navOpen, setNavOpen] = useState<boolean>(false);
 const [opacity, setOpacity] = useState<number>(0);
    useEffect(() => {
      setOpacity(1);
    }, [])

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
       <GridItem zIndex={1000} area={'nav'} overflow={'hidden'} bgGradient={inputBgColour}>
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
                <Box mt={4} ml={2}>
                  <Flex color={'gray.300'} gap={4} direction={'column'}>

                    <Text
                      _hover={{color: '#f08080', cursor: 'pointer'}}
                    ><Link to='/'>
                      Home
                      </Link>
                    </Text>

                    <Text
                      _hover={{color: '#f08080', cursor: 'pointer'}}
                    ><Link to='../app/practice/intervals'>
                      Interval Trainer
                      </Link>
                    </Text>

                    <Text
                      _hover={{color: '#f08080', cursor: 'pointer'}}
                    ><Link to='../app/practice/rhythm-reading'>
                      Rhythm Sight Reading
                      </Link>
                    </Text>

                    <Text
                      _hover={{color: '#f08080', cursor: 'pointer'}}
                    ><Link to='../app/practice/rhythm-transcription'>
                      Rhythm Transcription
                      </Link>
                    </Text>

                    <Text
                      _hover={{color: '#f08080', cursor: 'pointer'}}
                    ><Link to='../app/practice/notate-scale'>
                      Scale Construction
                      </Link>
                    </Text>

                  </Flex>
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
          <Box opacity={opacity} w='100%' h='100%'>
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
