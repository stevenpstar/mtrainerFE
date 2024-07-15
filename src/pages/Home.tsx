import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { HomeCard } from "../components/HomeCard";
import { FaBookReader, FaHammer, FaHeadphones } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { GiGraduateCap, GiWeightLiftingUp } from "react-icons/gi";
import { MdBarChart } from "react-icons/md";
import { useRef } from "react";
import { Link } from "react-router-dom";

function Home() {

  const featureRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const howitworksRef = useRef<HTMLDivElement | null>(null);

   return ( 
   <Box>
    <Box w='100%' h='60px' pos={'absolute'} color={'gray.200'} >
      <Center w='100%' h='100%'>
      <Flex w='100%' justify={'flex-end'} mr={6} gap={12}>
        <Text 
        _hover={{ color: '#f08080', cursor: 'pointer' }}
        onClick={() => {
          if (featureRef.current) {
            featureRef.current.scrollIntoView();
          }
        }}
        fontSize={'lg'}
        >Features</Text>
        <Text 
          _hover={{ color: '#f08080', cursor: 'pointer' }}
          onClick={() => {
          if (howitworksRef.current) {
            howitworksRef.current.scrollIntoView();
          }
        }}
        fontSize={'lg'}>How it works</Text>
        <Text 
          _hover={{ color: '#f08080', cursor: 'pointer' }}
          onClick={() => {
          if (pricingRef.current) {
            pricingRef.current.scrollIntoView();
          }
        }}
        fontSize={'lg'}>Pricing</Text>
        <Text 
        _hover={{ color: '#f08080', cursor: 'pointer' }}
       fontSize={'lg'}>
       <Link to='/app/practice'>
       Get Started
       </Link>
       </Text>
      </Flex>
      </Center>
    </Box>
    <Flex direction={'column'} w='100%' gap={0}>
      <Box minH={'600px'}  
        bgSize={'cover'} bgPos={['top', 'top', 'top', 'top', 'top', 'left']}>
        <Flex justify={'center'}>
        <Box mt={20} w='800px'>
          <Heading mt={14} ml={12} textAlign={'center'} bgGradient={'linear(to-r, white, #f08080)'} bgClip='text' size='3xl' as={'h1'}>
               Become a better musician by mastering the fundamentals
          </Heading>
          <Heading size={'sm'} textAlign={'center'} mt={8} ml={12} color={'gray.100'}>
            For beginners, professionals and everybody in-between.
          </Heading>
        </Box>
        </Flex>
      </Box>
      <Box ref={featureRef} minH='700px' w='100%' bgColor={'#0d0f12'} p={12}>
      <Center >
        <Heading bgGradient={'linear(to-l, #ffd6a5, #f08080)'} bgClip={'text'} size='md' mt={4} mb={12}>
          Achieve mastery through daily use of our practice tools.
        </Heading>
      </Center>
      <Center>
        <Box maxW={'1500px'} bgColor={'#0d0f12'}>
        <Flex gap={12} wrap={'wrap'} justify={'space-evenly'}>
          <HomeCard
            heading='Interval Recognition'
            body='Learn to hear and recognise the fundamental building blocks for chords and scales'
            icon={FaHeadphones}
            navTo='../app/practice/intervals' />

          <HomeCard
            heading='Rhythm Sight Reading'
            body='Train your rhythmic sight reading and sense of innate timing with this highly configurable tool.'
            icon={FaBookReader}
            navTo='../app/practice/rhythm-reading' />

         <HomeCard
            heading='Rhythm Transcription'
            body='Listen to a randomly generated rhythm and practice your transcription skills using our highly intuitive music scoring tool'
            icon={FaPencil}
            navTo='../app/practice/rhythm-transcription' />

          <HomeCard
            heading='Scale Construction'
            body='Test and expand your knowledge of scales and modes using our music scoring tool.'
            icon={FaHammer}
            navTo='../app/practice/notate-scale' />

        </Flex>
        </Box>
      </Center>
      </Box>
      <Box bgColor={'#0E1114'} ref={howitworksRef}>
     <Center w='100%' mb={24}>
        <Flex gap={6} direction={'column'} justify={'space-evenly'} w='600px'>
        <Heading bgGradient={'linear(to-r, #ffd6a5, #f08080)'} mt={12} mb={6} bgClip='text' size='md'>
          How it works.
        </Heading>
          <HomeCard
            heading='Structured Learning'
            body='Learn all the music theory and skills you will need with over X self-paced interactive structured lessons, 
            designed to teach you step by step.'
            icon={GiGraduateCap}
            navTo=""
          />
          <HomeCard
            heading='Daily Practice'
            body='Four highly configurable practice tools designed to test and improve your aural, theory and transcription skills.'
            icon={GiWeightLiftingUp}
            navTo=""
          />
          <HomeCard
            heading='Track your progress'
            body='Record all of your results and use them for efficient and targeted practice sessions.'
            icon={MdBarChart}
            navTo=""
          />
        </Flex>
      </Center>
      </Box>
      <Box bgColor={'#0d0f12'}>
     <Center>
        <Heading bgGradient={'linear(to-l, #ffd6a5, #f08080)'} bgClip={'text'} size='md' mb={12} mt={4}>
          Need an example? Here's our Interval Trainer in action!  
        </Heading>
      </Center>
      <Center>
        <video controls width='900'>
          <source src='/example.mp4' type='video/mp4' />
        </video>
      </Center>
      </Box>
    </Flex>
    </Box>
  )
}

export { Home };
