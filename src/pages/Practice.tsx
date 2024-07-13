import { Box, Center, Flex, Text } from "@chakra-ui/react"
import { HomeCard } from "../components/HomeCard"
import { FaBookReader, FaHammer, FaHeadphones } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"

function Practice() {
  return (
      <Center w='100%' h='100%'>
        <Flex direction={'column'} gap={12} wrap={'wrap'} justify={'space-evenly'}>
          <Box>
            <Text>The following are in early stages of development and may be missing features.</Text>
          </Box>
          <HomeCard
            heading='Interval Recognition'
            body='Learn to hear and recognise the fundamental building blocks for chords and scales'
            icon={FaHeadphones}
            navTo='intervals' />

          <HomeCard
            heading='Rhythm Sight Reading'
            body='Train your rhythmic sight reading and sense of innate timing with this highly configurable tool.'
            icon={FaBookReader}
            navTo='rhythm-reading' />

         <HomeCard
            heading='Rhythm Transcription'
            body='Listen to a randomly generated rhythm and practice your transcription skills using our highly intuitive music scoring tool'
            icon={FaPencil}
            navTo='rhythm-transcription' />

          <HomeCard
            heading='Scale Construction'
            body='Test and expand your knowledge of scales and modes using our music scoring tool.'
            icon={FaHammer}
            navTo='notate-scale' />

        </Flex>
      </Center>

  )
}

export { Practice }
