import { useEffect, useRef, useState } from "react";
// lib
import { cn } from "@/lib/common";
// local imports
import type { OpacityContainerClassNames, ValueObject } from "../types";

type Props = {
  classNames: OpacityContainerClassNames;
  color: ValueObject;
  onChange: (value: number) => void;
  value: number;
};

export const ColorPickerOpacityContainer: React.FC<Props> = (props) => {
  const { classNames, color, onChange, value } = props;
  // states
  const [pointerXPercent, setPointerXPercent] = useState<number>(value * 100);
  // refs
  const opacityContainerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  const handleOpacityContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const colorContainer = opacityContainerRef.current;
    if (!colorContainer) return;

    const rect = colorContainer.getBoundingClientRect();
    const resolvedX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, resolvedX / colorContainer.clientWidth)) * 100;
    setPointerXPercent(percent);
  };

  useEffect(() => {
    const colorContainer = opacityContainerRef.current;
    const pointer = pointerRef.current;
    if (!colorContainer || !pointer) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = colorContainer.getBoundingClientRect();
      const resolvedX = event.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, resolvedX / colorContainer.clientWidth)) * 100;
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
    const updatedValue = Number((pointerXPercent / 100).toFixed(2));
    onChange(updatedValue);
  }, [onChange, pointerXPercent]);

  return (
    <div
      ref={opacityContainerRef}
      className={cn("relative h-6 rounded-md", classNames.root)}
      style={{
        background: `url('/opacity-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={handleOpacityContainerClick}
    >
      <div
        className="absolute z-1 inset-0 size-full rounded-md"
        style={{
          background: `linear-gradient(to right, hsla(${color.hsl.h}, 100%, 50%, 0), hsla(${color.hsl.h}, 100%, 50%, 1))`,
        }}
      />
      <div
        ref={pointerRef}
        className={cn(
          "absolute z-1 h-[95%] aspect-square -translate-x-1/2 rounded-full border-4 border-white cursor-pointer",
          classNames.pointer
        )}
        style={{
          backgroundColor: `hsla(${color.hsl.h}, 100%, 50%, ${value})`,
          left: pointerXPercent + "%",
        }}
      />
    </div>
  );
};
