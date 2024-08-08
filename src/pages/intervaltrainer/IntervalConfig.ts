import { ConfigSettings } from "@/lib/sheet/entry.mjs";
import { normalTheme } from "@/utils/Theme";

const intervalConfig: ConfigSettings = {
  CameraSettings: {
    DragEnabled: true,
    ZoomEnabled: false,
    Zoom: 2,
    StartingPosition: { x: 0, y: 0 },
    CenterMeasures: true,
    CenterPage: false,
  },
  FormatSettings: {
    MeasureFormatSettings: {
      Selectable: false,
      MaxWidth: 200,
    }
  },
  NoteSettings: {
    InputValue: 0.5,
  },
  PageSettings: {
    RenderPage: true,
    RenderBackground: false,
    ContainerWidth: false,
    UsePages: true,
    AutoSize: true,
  },
  DefaultStaffType: 'single',
  Theme: normalTheme,
}

const landingConfig: ConfigSettings = {
  CameraSettings: {
    DragEnabled: false,
    ZoomEnabled: false,
    Zoom: 1.5,
    StartingPosition: { x: 0, y: 0 },
    CenterMeasures: false,
    CenterPage: false,
  },
  FormatSettings: {
    MeasureFormatSettings: {
      Selectable: false,
      MaxWidth: 200,
    }
  },
  NoteSettings: {
    InputValue: 0.5,
  },
  PageSettings: {
    RenderPage: false,
    RenderBackground: false,
    ContainerWidth: false,
    UsePages: false,
    AutoSize: true,
  },
  DefaultStaffType: 'single',
  Theme: normalTheme,
}


export { intervalConfig, landingConfig };

