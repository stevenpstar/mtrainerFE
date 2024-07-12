import { Box, Center, Flex, Grid, GridItem, Icon, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import {HiAcademicCap, HiBookOpen, HiChartBar, HiChartPie, HiUser} from "react-icons/hi"

function ProfileCardA() {
  const iconButtonColour = useColorModeValue('gray.800', 'white');
  const highlightColour = useColorModeValue('pink.500', 'pink.500')
  const navColour = useColorModeValue('linear(to-b, #164066, #0d1f42)','linear(to-b, #164066, #0d1f42)');

  return (
    <Box px={2}>
      <Grid
        templateAreas={
        `"profimage profdetails"
        "buttonrow buttonrow"`
        }
        gridTemplateRows={'190px 30px'}
        gridTemplateColumns={'1fr 2fr'}
        h='100%'
        w='100%'>
        <GridItem area={'profimage'} >
          <Box
            borderRadius={'100px'}
            w='120px' h='120px'
            bgGradient={navColour}></Box>
        </GridItem>
        <GridItem area={'profdetails'} textAlign={'left'}>
          <VStack color={'gray.900'}>
            <Text w='100%'>
            Lastname, Firstname
            </Text>
            <Text fontSize={'x-small'} w='100%'>
            Member since (date)
            </Text>
          </VStack>
        </GridItem>
       <GridItem area={'buttonrow'} >
        <Center h='100%' w='100%'>
        <Flex 
          align={'center'}
          justifyContent={'space-evenly'}
          w='100%'
          h='100%'>
        <Box
          as='button'
          borderRadius='0px'
          border='0px'
          _hover={{ color: 'blue.600'}}
          >
        <Icon as={HiAcademicCap} boxSize={5} color={iconButtonColour}/>
        </Box>

        <Box
          as='button'
          borderRadius='0px'
          border='0px'
          _hover={{ color: 'blue.600'}}
          >
        <Icon as={HiBookOpen} boxSize={5} color={iconButtonColour}/>
        </Box>

        <Box
          as='button'
          borderRadius='0px'
          border='0px'
          _hover={{ color: 'blue.600'}}
          >
        <Icon as={HiChartBar} boxSize={5} color={iconButtonColour}/>
        </Box>

        <Box
          as='button'
          borderRadius='0px'
          border='0px'
          _hover={{ color: 'blue.600'}}
          >
        <Icon as={HiUser} boxSize={5} color={iconButtonColour}/>
        </Box>

        </Flex>
        </Center>
        </GridItem>
      </Grid>
    </Box>
  )
}

export { ProfileCardA }
