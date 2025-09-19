// local imports
import type { ColorScheme } from "../types";

export const COLOR_SCHEMES: {
  key: ColorScheme;
  title: string;
  titleWithoutOpacity: string;
}[] = [
  {
    key: "rgba",
    title: "RGBA",
    titleWithoutOpacity: "RGB",
  },
  {
    key: "hex",
    title: "HEX",
    titleWithoutOpacity: "HEX",
  },
  {
    key: "hsla",
    title: "HSLA",
    titleWithoutOpacity: "HSL",
  },
];

export const DEFAULT_COLOR_VALUE: string = "#000000";
