import { ConfigSettings } from "@/lib/sheet/entry.mjs";
import { landingTheme, normalTheme } from "@/utils/Theme";

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
    },
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
  DefaultStaffType: "single",
  Theme: normalTheme,
};

const landingConfig: ConfigSettings = {
  CameraSettings: {
    DragEnabled: false,
    ZoomEnabled: false,
    Zoom: 1.25,
    StartingPosition: { x: 0, y: 50 },
    CenterMeasures: false,
    CenterPage: false,
  },
  FormatSettings: {
    MeasureFormatSettings: {
      Selectable: false,
      MaxWidth: 250,
    },
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
  DefaultStaffType: "single",
  Theme: landingTheme,
};

export { intervalConfig, landingConfig };
