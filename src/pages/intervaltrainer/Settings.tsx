import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

interface IntSettingProps {
  Settings: IntSettings;
  UpdateSettings: (settings: IntSettings) => void;
}

type IntSettings = {
  Unison: boolean;
  min2: boolean;
  Maj2: boolean;
  min3: boolean;
  Maj3: boolean;
  P4: boolean;
  Aug4Dim5: boolean;
  P5: boolean;
  min6: boolean;
  Maj6: boolean
  min7: boolean;
  Maj7: boolean;
  Oct: boolean;
  min9: boolean;
  Maj9: boolean;
  min10: boolean;
  Maj10: boolean;
  NeedNotate: boolean;
  NotateCount: number;
  Ascending: boolean;
  Descending: boolean;
  Together: boolean;
  PlaySelect: boolean;
  PlayInput: boolean;
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
  const [min9, setMin9] = useState<boolean>(true);
  const [Maj9, setMaj9] = useState<boolean>(true);
  const [min10, setMin10] = useState<boolean>(true);
  const [Maj10, setMaj10] = useState<boolean>(true);

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
    setMin9(settings.min9);
    setMaj9(settings.Maj9);
    setMin10(settings.min10);
    setMaj10(settings.Maj10);

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
      min9: min9,
      Maj9: Maj9,
      min10: min10,
      Maj10: Maj10,
      NeedNotate: notate,
      NotateCount: 1,
      Ascending: false,
      Descending: false,
      Together: true,
      PlaySelect: playSelect,
      PlayInput: playInput,
    }
    console.log("saved Settings: ", savedSettings);
    props.UpdateSettings(savedSettings);
  }

  if (loading) {
    return (<div></div>)
  }

  return (
    <div className="flex flex-col justify-evenly gap-4">
      <div className="flex flex-row justify-evenly">
        <div className="flex flex-col justify-start">
          <div>
            <Checkbox id="unison" defaultChecked={unison} onCheckedChange={() => setUnison(!unison)} /> Unison
          </div>
          <div>
            <Checkbox defaultChecked={min2} onCheckedChange={() => setMin2(!min2)} /> Minor 2nd
          </div>
          <div>
            <Checkbox defaultChecked={Maj2} onCheckedChange={() => setMaj2(!Maj2)} /> Major 2nd
          </div>
          <div>
            <Checkbox defaultChecked={min3} onCheckedChange={() => setMin3(!min3)} /> Minor 3rd
          </div>
          <div>
            <Checkbox defaultChecked={Maj3} onCheckedChange={() => setMaj3(!Maj3)} /> Major 3rd
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div>
            <Checkbox defaultChecked={P4} onCheckedChange={() => setP4(!P4)} /> Perfect 4th
          </div>
          <div>
            <Checkbox defaultChecked={Aug4Dim5} onCheckedChange={() => setAug4Dim5(!Aug4Dim5)} /> Aug4/Dim5
          </div>
          <div>
            <Checkbox defaultChecked={P5} onCheckedChange={() => setP5(!P5)} /> Perfect 5th
          </div>
          <div>
            <Checkbox id="min6" defaultChecked={min6} onCheckedChange={() => setMin6(!min6)} /> Minor 6th
          </div>
          <div>
            <Checkbox defaultChecked={Maj6} onCheckedChange={() => setMaj6(!Maj6)} /> Major 6th
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div>
            <Checkbox defaultChecked={min7} onCheckedChange={() => setMin7(!min7)} /> Minor 7th
          </div>
          <div>
            <Checkbox defaultChecked={Maj7} onCheckedChange={() => setMaj7(!Maj7)} /> Major 7th
          </div>
          <div>
            <Checkbox defaultChecked={Oct} onCheckedChange={() => setOct(!Oct)} /> Octave
          </div>
          <div>
            <Checkbox defaultChecked={min9} onCheckedChange={() => setMin9(!min9)} /> Minor 9th
          </div>
          <div>
            <Checkbox defaultChecked={Maj9} onCheckedChange={() => setMaj9(!Maj9)} /> Major 9th
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div>
            <Checkbox defaultChecked={min10} onCheckedChange={() => setMin10(!min9)} /> Minor 10th
          </div>
          <div>
            <Checkbox defaultChecked={Maj10} onCheckedChange={() => setMaj10(!Maj9)} /> Major 10th
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <Switch defaultChecked={notate} onCheckedChange={() => setNotate(notate => !notate)} /> Notate Answer
      </div>
      <div>
        <Switch defaultChecked={playSelect} onCheckedChange={() => setPlaySelect(playSelect => !playSelect)} /> Play Note on Select
      </div>
      <div>
        <Switch defaultChecked={playInput} onCheckedChange={() => setPlayInput(playInput => !playInput)} /> Play Note on Input
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={() => Save()}>Save</Button>
      </div>
    </div>
  )
}

export { IntervalSettings, type IntSettings }
