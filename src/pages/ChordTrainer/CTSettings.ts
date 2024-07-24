import { ConfigSettings } from "@/lib/sheet/entry.mjs";
import { normalTheme } from "@/utils/Theme";

  export const CTSettings: ConfigSettings = {
    CameraSettings: {
      DragEnabled: false,
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
    MeasureSettings: {
      TopLine: 0,
      BottomLine: 35,
    },
    DefaultStaffType: 'single',
    Theme: normalTheme,
  }
