import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash-es";
import type tinyColor from "tinycolor2";
// lib
import { cn } from "@/lib/common";
// local imports
import { DEFAULT_COLOR_VALUE } from "./constants";
import { ColorPickerFooter } from "./footer";
import { ColorPickerHueContainer } from "./hue-container";
import { ColorPickerOpacityContainer } from "./opacity-container";
import { ColorPickerPreDefinedColors } from "./pre-defined-colors";
import { ColorPickerSaturationContainer } from "./saturation-container";
import type { ColorPickerProps, ColorScheme, ValueHSL, ValueObject } from "../types";
import { getAlphaFromValue, getValueObjectFromValue } from "../utils";

export const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const {
    classNames = {},
    debounceTime = 100,
    hideOpacityPicker = false,
    onChange,
    onColorDisplayClick,
    predefinedColors = [],
    value = DEFAULT_COLOR_VALUE,
  } = props;
  // states
  const [color, setColor] = useState<ValueObject>(getValueObjectFromValue(value, !hideOpacityPicker));
  const [alpha, setAlpha] = useState<number>(getAlphaFromValue(value));
  const [selectedDisplayScheme, setSelectedDisplayScheme] = useState<ColorScheme>("hex");

  // create debounced onChange function
  const debouncedOnChange = useCallback(
    debounce((value: ValueObject) => {
      onChange?.(value);
    }, debounceTime),
    [debounceTime, onChange]
  );

  useEffect(() => {
    const valueObject = getValueObjectFromValue(
      {
        ...color.hsl,
        a: alpha,
      },
      !hideOpacityPicker
    );
    console.log("valueObject", valueObject);
    debouncedOnChange(valueObject);
  }, [color, alpha, debouncedOnChange, hideOpacityPicker]);

  const handleColorChange = useCallback(
    (value: ValueHSL) => {
      const valueObject = getValueObjectFromValue(value, !hideOpacityPicker);
      setColor(valueObject);
    },
    [hideOpacityPicker]
  );

  const handleAlphaChange = useCallback((value: number) => {
    setAlpha(value);
  }, []);

  const handlePreDefinedColorClick = useCallback(
    (value: ValueObject) => {
      const hslValue: tinyColor.ColorFormats.HSL = {
        h: value.hsl.h,
        s: value.hsl.s,
        l: value.hsl.l,
      };
      setColor(getValueObjectFromValue(hslValue, !hideOpacityPicker));
    },
    [hideOpacityPicker]
  );

  return (
    <div className={cn("w-72 space-y-6", classNames.root)}>
      <ColorPickerSaturationContainer
        alpha={alpha}
        classNames={classNames.saturationContainer ?? {}}
        isOpacityEnabled={!hideOpacityPicker}
        onChange={handleColorChange}
        onColorDisplayClick={onColorDisplayClick}
        selectedDisplayScheme={selectedDisplayScheme}
        value={color}
      />
      <ColorPickerHueContainer
        classNames={classNames.colorContainer ?? {}}
        onChange={handleColorChange}
        value={color}
      />
      {!hideOpacityPicker && (
        <ColorPickerOpacityContainer
          classNames={classNames.opacityContainer ?? {}}
          color={color}
          onChange={handleAlphaChange}
          value={alpha}
        />
      )}
      <ColorPickerPreDefinedColors
        classNames={classNames.predefinedColorsContainer ?? {}}
        colorsList={predefinedColors}
        onColorClick={handlePreDefinedColorClick}
      />
      <ColorPickerFooter
        classNames={classNames.footer ?? {}}
        isOpacityEnabled={!hideOpacityPicker}
        selectedDisplayScheme={selectedDisplayScheme}
        setSelectedDisplayScheme={setSelectedDisplayScheme}
      />
    </div>
  );
};
