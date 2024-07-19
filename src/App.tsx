import './App.css'
import { Box, Button, Center, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Icon, IconButton, Show, Text, useColorModeValue } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { RiMenuUnfoldFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

function App() {
 // const inputBgColour = useColorModeValue('linear(to-b, #f08080, #ffd6a5)', 'black');
  const navGradient = useColorModeValue('linear(to-b, #16191F, #262B36)', 'black');

  const [navOpen, setNavOpen] = useState<boolean>(false);
 const [opacity, setOpacity] = useState<number>(0);
    useEffect(() => {
      setOpacity(1);
    }, [])

  return (
    <Box px={0} w='100%' className='h-full' bgColor={'#0e1114'}>
        <Flex 
        direction={'column'}
        justify={'flex-start'}
        gap={0}
        h='100%'
        w='100%'
        >
        <Box w='100%' hidden={true} h={{base: '40px', sm: '40px', md: '40px', lg: '40px'}} className='bg-zinc-900'>
        <Show below='md'>
        <Flex justify={'flex-start'}>
        <Button aria-label='stop test' border={'0px solid transparent'} variant='ghost' size='sm' color={'#262b36'} 
          leftIcon={<Icon as={RiMenuUnfoldFill} boxSize={6} />}
          _hover={{ bgColor: 'transparent', color: 'white', border: '0px transparent'}}
          _focus={{ bgColor: 'transparent', color: 'white', border: '0px transparent', outline: 'none'}}
          onClick={() => setNavOpen(true)}
          zIndex={1000}
        ></Button>
        </Flex>
        </Show>
        <Show above='md'>

          <Flex color={'gray.300'} className='h-0' hidden={true} justify={'space-between'} w='100%'>
            <Center h='50%'>
              <Box ml={4}><Text>MTrainerFE</Text></Box>
            </Center>
            <Box>
            <Center h='50%'>
              <Flex justify={'flex-end'} gap={4} mr={4}>
                <Box><Text>Courses</Text></Box>
                <Box><Text>Practice</Text></Box>
                <Box><Text>Account</Text></Box>
              </Flex>
              </Center>
            </Box>
          </Flex>
        </Show>
        </Box>

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
                <Box h='100%' w='40px' bgGradient={'transparent'}>
                  <Center>
                  <IconButton 
                    backgroundColor={'transparent'}
                    aria-label='Close Navigation' 
                    color={'#f08080'}
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
          <Box className='bg-zinc-50 grow heey' opacity={opacity} w='100%'>
            <Outlet />
          </Box>
        </Flex>
    </Box>
  )
}

export default App


/* old header
 *        <Box w='100%'>
          <Header image=""/>
        </Box>

 * */
