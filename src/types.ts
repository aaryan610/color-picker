export type ColorPickerProps = {
  classNames?: {
    root?: string;
    saturationContainer?: SaturationContainerClassNames;
    colorContainer?: HueContainerClassNames;
    opacityContainer?: OpacityContainerClassNames;
    predefinedColorsContainer?: PreDefinedColorsContainerClassNames;
    footer?: FooterClassNames;
  };
  debounceTime?: number;
  hideOpacityPicker?: boolean;
  onChange?: (value: ValueObject) => void;
  onColorDisplayClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  predefinedColors?: Value[];
  value?: Value;
};

export type Value = string | ValueRGB | ValueHSL;

export type ValueObject = {
  hex: string;
  rgb: ValueRGB;
  hsl: ValueHSL;
};

export type ValueRGB = {
  r: number;
  g: number;
  b: number;
  /**
   * @description The alpha value of the color from 0 to 1
   */
  a?: number;
};

export type ValueHSL = {
  h: number;
  s: number;
  l: number;
  /**
   * @description The alpha value of the color from 0 to 1
   */
  a?: number;
};

export type SaturationContainerClassNames = {
  colorDisplay?: {
    icon?: string;
    root?: string;
    text?: string;
  };
  pointer?: string;
  root?: string;
};

export type HueContainerClassNames = {
  pointer?: string;
  root?: string;
};

export type OpacityContainerClassNames = {
  pointer?: string;
  root?: string;
};

export type PreDefinedColorsContainerClassNames = {
  item?: string;
  root?: string;
};

export type FooterClassNames = {
  colorSchemePicker?: {
    root?: string;
    item?: string;
    activeItem?: string;
    separator?: string;
  };
  root?: string;
};

export type ColorScheme = "rgba" | "hsla" | "hex";
