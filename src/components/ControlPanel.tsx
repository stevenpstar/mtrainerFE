import { Box, HStack, Icon, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { App as application } from "../lib/sheet/entry.mjs";
import { Note as SinthNote } from "../lib/sinth/main.mjs";
import { IoIosMusicalNotes, IoIosPlay, IoIosSettings, IoIosVolumeHigh } from "react-icons/io";
import { GiArrowCursor } from "react-icons/gi";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

interface ControlPanelProps {
  score: application | null;
  inputting: boolean;
  volume: number;
  setInputting: (a: boolean) => void;
  setVolume: (vol: number) => void;
  setNotes: (notes: SinthNote[]) => void;
  openSettings: (open: boolean) => void;
  Play: () => void;
}

function ControlPanel(props: ControlPanelProps) {

  const [changeVolume, setChangeVolume] = useState<boolean>(false);

  const { score, inputting, volume, setInputting, setVolume } = props;
  return (
    <Box w='100%' p={0} m={0} >
      <HStack color={'gray.800'} h={'50'}>
        <Box>
          <HStack gap={2}>

            <IconButton 
              p={0}
              border={0}
              outline={0}
              color={!inputting ? 'gray.800' : 'blue.400'}
              bgColor={'transparent'}
              aria-label='Input Notes'
              icon={<Icon as={IoIosMusicalNotes} boxSize={5}/>}
              _hover={{color: 'blue.300'}}
              _focus={{outline: '0px', transition: '0.0s'}}
              transition={'0.1s'}
              onClick={() => {
               if (score) {
                 score.NoteInput = true;
                 setInputting(true);
               }}
               } />

           <IconButton 
              p={0}
              border={0}
              outline={0}
              color={inputting ? 'gray.800' : 'blue.400'}
              bgColor={'transparent'}
              aria-label='Input Notes'
              icon={<Icon as={GiArrowCursor} boxSize={5}/>}
              _hover={{color: 'blue.300'}}
              _focus={{outline: '0px', transition: '0.0s'}}
              transition={'0.1s'}
              onClick={() => {
               if (score) {
                 score.NoteInput = false;
                 setInputting(false);
               }}
               } />
           </HStack>
        </Box>
           <IconButton 
              p={0}
              border={0}
              outline={0}
              color={'gray.800'}
              bgColor={'transparent'}
              aria-label='Input Notes'
              icon={<Icon as={IoIosPlay} boxSize={5}/>}
              _hover={{color: 'blue.300'}}
              _focus={{outline: '0px', transition: '0.0s'}}
              transition={'0.1s'}
              onClick={() => props.Play()} />

           <IconButton 
              p={0}
              border={0}
              outline={0}
              color={'gray.800'}
              bgColor={'transparent'}
              aria-label='Input Notes'
              icon={<Icon as={IoIosSettings} boxSize={5}/>}
              _hover={{color: 'blue.300'}}
              _focus={{outline: '0px', transition: '0.0s'}}
              transition={'0.1s'}
              onClick={() => props.openSettings(true)} />


        <Icon as={IoIosVolumeHigh} color={'gray.800'}boxSize={6} onClick={() => setChangeVolume(!changeVolume)}/>
        { changeVolume && 
          <Box>
            <Slider
            aria-label='volume-slider'
            defaultValue={volume}
            w='100px'
            onChangeEnd={(val) => setVolume(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        }
              <Icon as={RxCross2} boxSize={6} 
                onClick={() => {
                  if (score) {
                    score.Delete();
                  }
                }}
              />

      </HStack>
      </Box>
  )
}

export { ControlPanel }
