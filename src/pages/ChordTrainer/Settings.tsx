import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

interface ChordSettingsProps {
  Settings: ChrdSettings;
  UpdateSettings: (settings: ChrdSettings) => void;
}

type ChrdSettings = {
  Major: boolean;
  Minor: boolean;
  Maj7: boolean;
  Min7: boolean;
  Notate: boolean;
  Root: boolean;
  Inv1: boolean;
  Inv2: boolean;
}

function ChordSettings(props: ChordSettingsProps) {

  // Chord settings state
  const [major, setMajor] = useState<boolean>(true);
  const [minor, setMinor] = useState<boolean>(true);
  const [maj7, setMaj7] = useState<boolean>(true);
  const [min7, setMin7] = useState<boolean>(true);
  // Inversion settings state
  const [root, setRoot] = useState<boolean>(true);
  const [inv1, setInv1] = useState<boolean>(true);
  const [inv2, setInv2] = useState<boolean>(true);
  // Other
  const [notate, setNotate] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const SetValues = (settings: ChrdSettings) => {
    setMajor(settings.Major);
    setMinor(settings.Minor);
    setMaj7(settings.Maj7);
    setMin7(settings.Min7);
    setRoot(settings.Root);
    setInv1(settings.Inv1);
    setInv2(settings.Inv2);
    setNotate(settings.Notate);
    setLoading(false);
  }

  const Save = () => {
    const savedSettings: ChrdSettings = {
      Major: major,
      Minor: minor,
      Maj7: maj7,
      Min7: min7,
      Notate: notate,
      Root: root,
      Inv1: inv1,
      Inv2: inv2,
    };

    props.UpdateSettings(savedSettings);
  }

  useEffect(() => {
    SetValues(props.Settings);
  }, [])

  if (loading) {
    return (<div></div>)
  }

  return (
    <div className="flex flex-col justify-evenly gap-4">
      <div className="flex flex-row justify-evenly">
        <div className="flex flex-col justify-start">
          <div>
            <Checkbox id="major"
              defaultChecked={major}
              onCheckedChange={() => setMajor(!major)} /> Major
          </div>
          <div>
            <Checkbox id="minor"
              defaultChecked={minor}
              onCheckedChange={() => setMinor(!minor)} /> Minor
          </div>
          <div>
            <Checkbox id="maj7"
              defaultChecked={maj7}
              onCheckedChange={() => setMaj7(!maj7)} /> Major 7
          </div>
          <div>
            <Checkbox id="min7"
              defaultChecked={min7}
              onCheckedChange={() => setMin7(!min7)} /> Minor 7
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div>
            <Switch defaultChecked={notate} onCheckedChange={() => setNotate(notate => !notate)} /> Notate
          </div>
          <div>
            <Switch defaultChecked={root} onCheckedChange={() => setRoot(root => !root)} /> No Inversion
          </div>
          <div>
            <Switch defaultChecked={inv1} onCheckedChange={() => setInv1(inv1 => !inv1)} /> First Inversion
          </div>
          <div>
            <Switch defaultChecked={inv2} onCheckedChange={() => setInv2(inv2 => !inv2)} /> Second Inversion
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={() => Save()}>Save</Button>
      </div>

    </div>
  )
}

export { ChordSettings, type ChrdSettings }
