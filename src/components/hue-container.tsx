import { useEffect, useMemo, useRef, useState } from "react";
// lib
import { cn } from "@/lib/common";
// local imports
import type { HueContainerClassNames, ValueHSL, ValueObject } from "../types";

type Props = {
  classNames: HueContainerClassNames;
  onChange: (value: ValueHSL) => void;
  value: ValueObject;
};

export const ColorPickerHueContainer: React.FC<Props> = (props) => {
  const { classNames, onChange, value } = props;
  // calculate the hue from RGB and convert to percentage position
  const pointerXOffset = useMemo(() => {
    const hueValue = value.hsl.h;
    return hueValue / 360; // convert hue (0-360) to percentage (0-1)
  }, [value]);
  // states - store as percentage (0-1)
  const [pointerXPercent, setPointerXPercent] = useState<number>(pointerXOffset);
  // refs
  const colorContainerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  const handleColorContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const colorContainer = colorContainerRef.current;
    if (!colorContainer) return;

    const rect = colorContainer.getBoundingClientRect();
    const resolvedX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, resolvedX / rect.width));
    setPointerXPercent(percent);
  };

  useEffect(() => {
    const colorContainer = colorContainerRef.current;
    const pointer = pointerRef.current;
    if (!colorContainer || !pointer) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = colorContainer.getBoundingClientRect();
      const resolvedX = event.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, resolvedX / rect.width));
      setPointerXPercent(percent);
    };

    const handleMouseDown = () => {
      window.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };

    colorContainer.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      colorContainer.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // update the color when pointer position changes
  useEffect(() => {
    const hue = Math.min(359, pointerXPercent * 360);
    onChange({
      h: hue,
      s: value.hsl.s,
      l: value.hsl.l,
    });
  }, [onChange, pointerXPercent]);

  // update pointer position when value prop changes externally
  useEffect(() => {
    setPointerXPercent(pointerXOffset);
  }, [pointerXOffset]);

  return (
    <div
      ref={colorContainerRef}
      className={cn("relative h-6 rounded-md", classNames.root)}
      style={{
        background:
          "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0)",
      }}
      onClick={handleColorContainerClick}
    >
      <div
        ref={pointerRef}
        className={cn(
          "absolute z-1 h-[95%] aspect-square -translate-x-1/2 rounded-full border-4 border-white cursor-pointer",
          classNames.pointer
        )}
        style={{
          backgroundColor: `hsl(${value.hsl.h}, 100%, 50%)`,
          left: `${pointerXPercent * 100}%`,
        }}
      />
    </div>
  );
};
