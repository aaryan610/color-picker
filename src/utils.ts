import tinyColor from "tinycolor2";
// local imports
import type { Value, ValueObject } from "./types";

/**
 * @description Get the hsl scheme from the value
 * @param {Value} value The value to get the hsl scheme from
 * @param {boolean} isOpacityEnabled Whether the opacity is enabled
 * @returns {ValueObject} The value object from the value
 * @example
 * getValueObjectFromValue({ hex: "#000000" }, true) // { hex: "#000000ff", rgb: { r: 0, g: 0, b: 0, a: 1 }, hsl: { h: 0, s: 0, l: 0, a: 1 }, alpha: 1 }
 * getValueObjectFromValue({ hex: "#000000" }, false) // { hex: "#000000", rgb: { r: 0, g: 0, b: 0, a: 1 }, hsl: { h: 0, s: 0, l: 0, a: 1 }, alpha: 1 }
 */
export const getValueObjectFromValue = (value: Value, isOpacityEnabled: boolean): ValueObject => {
  const color = tinyColor(value);
  const isValid = color.isValid();
  if (!isValid) {
    console.error("Color picker: invalid color received", value);
    return {
      hex: isOpacityEnabled ? "#000000ff" : "#000000",
      rgb: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      hsl: {
        h: 0,
        s: 0,
        l: 0,
        a: 1,
      },
    };
  }

  const rgb = color.toRgb();
  const hsl = color.toHsl();

  return {
    hex: isOpacityEnabled ? color.toHex8String() : color.toHexString(),
    rgb: {
      ...rgb,
      a: Number(rgb.a.toFixed(2)),
    },
    hsl: {
      h: Number(hsl.h.toFixed(0)),
      s: Number((hsl.s * 100).toFixed(0)),
      l: Number((hsl.l * 100).toFixed(0)),
      a: Number(hsl.a.toFixed(2)),
    },
  };
};

/**
 * @description Get the alpha from the value
 * @param {Value} value The value to get the alpha from
 * @returns {number} The alpha from the value
 * @example
 * getAlphaFromValue("#000000") // 1
 * getAlphaFromValue("#00000000") // 0
 * getAlphaFromValue("#000000ff") // 1
 * getAlphaFromValue("#00000080") // 0.5
 * @returns {number} The alpha from the value
 */
export const getAlphaFromValue = (value: Value): number => {
  const color = tinyColor(value);

  const isValid = color.isValid();
  if (!isValid) {
    console.error("Color picker: invalid color received", value);
    return 1;
  }

  return Number(color.getAlpha().toFixed(2));
};
