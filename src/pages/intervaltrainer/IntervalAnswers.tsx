import { Flex } from "@chakra-ui/react"
import { ITButton } from "./ITButton";

interface IAProps {
  setInterval: (a: string) => void;
  getButtonColour: (a: string) => string;
}

function IntervalAnswers(props: IAProps) {
  const { setInterval, getButtonColour } = props;
  return (
    <Flex fontSize='1em' color={'gray.200'} gap={1} justify={'space-evenly'} w='100%'>
      <Flex direction={'column'} justify={'flex-start'} gap={1}>
        <ITButton
          d={'Unison'}
          a={'Unison'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
      </Flex>
      <Flex direction={'column'} justify={'flex-start'} gap={1}>
        <ITButton
          d={'Minor 2nd'}
          a={'min2'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
        <ITButton
          d={'Major 2nd'}
          a={'Maj2'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
      </Flex>
      <Flex direction={'column'} justify={'flex-start'} gap={1}>
        <ITButton
          d={'Minor 3rd'}
          a={'min3'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
        <ITButton
          d={'Major 3rd'}
          a={'Maj3'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
      </Flex>
      <Flex direction={'column'} justify={'flex-start'} gap={1}>
        <ITButton
          d={'Perfect 4th'}
          a={'P4'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
        <ITButton
          d={'Aug4/Dim5'}
          a={'Aug4/Dim5'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
         <ITButton
          d={'Perfect 5th'}
          a={'P5'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
     </Flex>
      <Flex direction={'column'} justify={'flex-start'} gap={2}>
        <ITButton
          d={'Minor 6th'}
          a={'min6'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
        <ITButton
          d={'Major 6th'}
          a={'Maj6'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
      </Flex>
      <Flex direction={'column'} justify={'flex-start'} gap={2}>
        <ITButton
          d={'Minor 7th'}
          a={'min7'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
        <ITButton
          d={'Major 7th'}
          a={'Maj7'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
      </Flex>
      <Flex direction={'column'} justify={'flex-start'} gap={2}>
         <ITButton
          d={'Octave'}
          a={'Oct'}
          setInterval={setInterval}
          getButtonColour={getButtonColour}
        />
      </Flex>
    </Flex>
  )
}

export { IntervalAnswers }
