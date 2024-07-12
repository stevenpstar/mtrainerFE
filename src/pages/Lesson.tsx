import { Box, Center, Grid, GridItem, Heading, Icon, List, ListIcon, ListItem } from "@chakra-ui/react"
import Markdown from "react-markdown"
import { useState } from "react";
import { IoEllipseOutline, IoEllipseSharp } from "react-icons/io5";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const test = `
# Chapter 1 - Crotchets
  

This is lesson content. Is it centered? No? Good!

`;

const genericContent = `
This is paragraph A, where we talk about A

This is paragraph B, which is where we talk about B
`;

function Lesson() {

  const [lessonOutline, setLessonOutline] = useState<boolean>(true);
  return ( <Box w='100%' h='100%'>
    <Grid
      templateAreas={`"nav bar content"`}
      gridTemplateRows={'100%'}
      gridTemplateColumns={lessonOutline ? '15% 30px 1fr' : '0px 30px 1fr'}
      h='100%'
      w='100%'
      transitionDuration={'0.2s'}
      transitionDelay={'0.1s'}>
      <GridItem area={'nav'} textAlign={'left'} bgColor={'#e1edf7'}fontSize={16} overflowY={lessonOutline ? 'hidden' : 'hidden'}>
        <Box w='100%' h='12px'>
        </Box>
        <List spacing={3} fontWeight={'500'} opacity={lessonOutline ? '1' : '0'} transitionDuration={'0.2s'} transitionDelay={lessonOutline ? '0.3s' : '0.0s'}>
          <Heading textAlign={'center'} as='h3' size='md'>Transcribing Rhythm Part 1</Heading>
          <ListItem p={2} bgColor={'#dcebf5'}> 
            <ListIcon as={IoEllipseSharp} color={'green.500'} />
            Chapter 1 - heiagh eaoig hiaeohg ioahg
          </ListItem>
          <ListItem p={2}>
            <ListIcon as={IoEllipseOutline} color={'orange.500'} />
            Chapter 2 - heiagh eaoighiaeoh gioahg
          </ListItem>
          <ListItem p={2} bgColor={'#dcebf5'}>
            <ListIcon as={IoEllipseOutline} color={'orange.500'} />
            Chapter 3 - heiagh eaoi ghiaeohgioahg
          </ListItem>
          <ListItem p={2}>
            <ListIcon as={IoEllipseOutline} color={'orange.500'} />
            Chapter 4 - heiagh eaoigh iaeohgioahg
          </ListItem>

        </List>
      </GridItem>
      <GridItem area={'bar'} pt={2} bgColor={'#e1edf7'} borderRight={lessonOutline ? '0px' : '0px solid #dedede'}>
        <Box w='100%'h='30px'
          borderRadius={'100px'}
          _hover={{ cursor: 'pointer', backgroundColor: 'gray.200', color: 'red.700' }}>
        <Center h='100%' w='100%'>
      { lessonOutline &&
        <Icon as={GoChevronLeft} boxSize={6}
          onClick={() => setLessonOutline(false)}/>
      } { !lessonOutline &&
        <Icon as={GoChevronRight} boxSize={6}
          onClick={() => setLessonOutline(true)}/>
      }
      </Center>
      </Box>
     
      </GridItem>
      <GridItem p={8} area={'content'} textAlign={'left'} overflowY={'scroll'}>
        <Center>
        <Box w='80%'>
        <Markdown className='lesson-content'>
          {test}
        </Markdown>
        <Markdown>
          {genericContent}
        </Markdown>
        <Markdown>
          {genericContent}
        </Markdown>
        <Markdown>
          {genericContent}
        </Markdown>
        </Box>
        </Center>
      </GridItem>
      <GridItem area={'space'}></GridItem>
    </Grid>
  </Box> )
}

export { Lesson }
