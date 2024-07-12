import { Box, Button, Checkbox, Flex, Switch } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { IntSettings } from "../IntervalTrainer";

interface IntSettingProps {
  Settings: IntSettings;
  UpdateSettings: (settings: IntSettings) => void;
}

function IntervalSettings(props: IntSettingProps) {

  const [unison, setUnison] = useState<boolean>(true);
  const [min2, setMin2] = useState<boolean>(true);
  const [Maj2, setMaj2] = useState<boolean>(true);
  const [min3, setMin3] = useState<boolean>(true);
  const [Maj3, setMaj3] = useState<boolean>(true);
  const [P4, setP4] = useState<boolean>(true);
  const [Aug4Dim5, setAug4Dim5] = useState<boolean>(true);
  const [P5, setP5] = useState<boolean>(true);
  const [min6, setMin6] = useState<boolean>(true);
  const [Maj6, setMaj6] = useState<boolean>(true);
  const [min7, setMin7] = useState<boolean>(true);
  const [Maj7, setMaj7] = useState<boolean>(true);
  const [Oct, setOct] = useState<boolean>(true);

  const [notate, setNotate] = useState<boolean>(true);
  const [playSelect, setPlaySelect] = useState<boolean>(true);
  const [playInput, setPlayInput] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const SetValues = (settings: IntSettings) => {
    setUnison(settings.Unison);
    setMin2(settings.min2);
    setMaj2(settings.Maj2);
    setMin3(settings.min3);
    setMaj3(settings.Maj3);
    setP4(settings.P4);
    setAug4Dim5(settings.Aug4Dim5);
    setP5(settings.P5);
    setMin6(settings.min6);
    setMaj6(settings.Maj6);
    setMin7(settings.min7);
    setMaj7(settings.Maj7);
    setOct(settings.Oct);

    setNotate(settings.NeedNotate);
    setPlaySelect(settings.PlaySelect);
    setPlayInput(settings.PlayInput);

    setLoading(false);
  }

  useEffect(() => {
    SetValues(props.Settings);
  }, []);

  const Save = () => {
    const savedSettings: IntSettings = {
      Unison: unison,
      min2: min2,
      Maj2: Maj2,
      min3: min3,
      Maj3: Maj3,
      P4: P4,
      Aug4Dim5: Aug4Dim5,
      P5: P5,
      min6: min6,
      Maj6: Maj6,
      min7: min7,
      Maj7: Maj7,
      Oct: Oct,
      NeedNotate: notate,
      NotateCount: 1,
      Ascending: false,
      Descending: false,
      Together: true,
      PlaySelect: playSelect,
      PlayInput: playInput,
    }
    props.UpdateSettings(savedSettings);
  }

  const answers: string[] = [
    "Unison",
    "min2",
    "Maj2",
    "min3",
    "Maj3",
    "P4",
    "Aug4/Dim5",
    "P5",
    "min6",
    "Maj6",
    "min7",
    "Maj7",
    "Oct"
  ]

  if (loading) {
    return ( <div></div> )
  }

  return (
    <Flex direction={'column'} justify={'flex-start'} gap={4} w='100%'>
      <Flex gap={6} direction={'column'} justify={'space-between'} w='100%'>
      <Box w='100%'>
        <Flex direction={'row'} width='100%' justify={'space-between'} wrap={'wrap'} gap={4}>
          <Box w='100px'>
          <Checkbox size={'sm'} defaultChecked={unison} onChange={() => setUnison(!unison)}>Unison</Checkbox>
          <Checkbox size={'sm'} defaultChecked={min2} onChange={() => setMin2(!min2)}>min2</Checkbox>
          <Checkbox size={'sm'} defaultChecked={Maj2} onChange={() => setMaj2(!Maj2)}>Maj2</Checkbox>
          <Checkbox size={'sm'} defaultChecked={min3} onChange={() => setMin3(!min3)}>min3</Checkbox>
          </Box>
          <Box w='100px'>
          <Checkbox size={'sm'} defaultChecked={Maj3} onChange={() => setMaj3(!Maj3)}>Maj3</Checkbox><p></p>
          <Checkbox size={'sm'} defaultChecked={P4} onChange={() => setP4(!P4)}>P4</Checkbox>
          <Checkbox size={'sm'} defaultChecked={Aug4Dim5} onChange={() => setAug4Dim5(!Aug4Dim5)}>Aug4/Dim5</Checkbox>
          <Checkbox size={'sm'} defaultChecked={P5} onChange={() => setP5(!P5)}>P5</Checkbox>
          </Box>
          <Box w='100px'>
          <Checkbox size={'sm'} defaultChecked={min6} onChange={() => setMin6(!min6)}>min6</Checkbox>
          <Checkbox size={'sm'} defaultChecked={Maj6} onChange={() => setMaj6(!Maj6)}>Maj6</Checkbox>
          <Checkbox size={'sm'} defaultChecked={min7} onChange={() => setMin7(!min7)}>min3</Checkbox>
          <Checkbox size={'sm'} defaultChecked={Maj7} onChange={() => setMaj7(!Maj7)}>Maj3</Checkbox>
          </Box>
          <Box w='100px'>
          <Checkbox size={'sm'} defaultChecked={Oct} onChange={() => setOct(!Oct)}>Oct</Checkbox>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Flex direction={'column'} justify={'flex-start'} gap={6}>
          <Switch defaultChecked={notate} size={'sm'} onChange={() => setNotate(v => !notate)}>Notate Answer</Switch>
          <Switch defaultChecked={playSelect} size={'sm'} onChange={() => setPlaySelect(v => !playSelect)}>Play Note on Select</Switch>
          <Switch defaultChecked={playInput} size={'sm'} onChange={() => setPlayInput(v => !playInput)}>Play Note on Input</Switch>
        </Flex>
      </Box>
      <Box>
        <Button onClick={() => Save()}>Save</Button>
      </Box>
      </Flex>
    </Flex>
  )
}

export { IntervalSettings }
