import { useEffect, useMemo, useRef, useState } from "react";
import { Files } from "lucide-react";
import tinyColor from "tinycolor2";
// lib
import { cn } from "@/lib/common";
// local imports
import type { ColorScheme, SaturationContainerClassNames, ValueHSL, ValueObject } from "../types";

type Props = {
  alpha: number;
  classNames: SaturationContainerClassNames;
  isOpacityEnabled: boolean;
  onChange: (value: ValueHSL) => void;
  onColorDisplayClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedDisplayScheme: ColorScheme;
  value: ValueObject;
};

export const ColorPickerSaturationContainer: React.FC<Props> = (props) => {
  const { alpha, classNames, isOpacityEnabled, onChange, onColorDisplayClick, selectedDisplayScheme, value } = props; // Calculate initial pointer position from HSL value
  const initialPointerPosition = useMemo(() => {
    // Convert HSL to HSV to match the gradient
    const hsvColor = tinyColor(value.hsl).toHsv();
    return {
      x: hsvColor.s, // saturation (0-1)
      y: 1 - hsvColor.v, // value inverted (0-1, where 0 is top/bright, 1 is bottom/dark)
    };
  }, [value.hsl]);
  // states - store as percentage (0-1)
  const [pointerPosition, setPointerPosition] = useState<{ x: number; y: number }>(initialPointerPosition);
  // Store current hue separately
  const currentHue = useRef(value.hsl.h);
  // refs
  const shadeContainerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const colorDisplayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentHue.current = value.hsl.h;
  }, [value.hsl.h]);

  const handleShadeContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const shadeContainer = shadeContainerRef.current;
    const colorDisplay = colorDisplayRef.current;
    if (!shadeContainer || !colorDisplay) return;

    if (colorDisplay.contains(e.target as Node)) {
      return;
    }

    const rect = shadeContainer.getBoundingClientRect();
    const resolvedX = e.clientX - rect.left;
    const resolvedY = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(1, resolvedX / rect.width));
    const percentY = Math.max(0, Math.min(1, resolvedY / rect.height));

    setPointerPosition({
      x: percentX,
      y: percentY,
    });
  };

  useEffect(() => {
    const shadeContainer = shadeContainerRef.current;
    const pointer = pointerRef.current;
    if (!shadeContainer || !pointer) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = shadeContainer.getBoundingClientRect();
      const resolvedX = event.clientX - rect.left;
      const resolvedY = event.clientY - rect.top;

      const percentX = Math.max(0, Math.min(1, resolvedX / rect.width));
      const percentY = Math.max(0, Math.min(1, resolvedY / rect.height));

      setPointerPosition({
        x: percentX,
        y: percentY,
      });
    };

    const handleMouseDown = () => {
      window.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };

    shadeContainer.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      shadeContainer.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    // HSV coordinates that match the gradient
    const hsvSaturation = pointerPosition.x * 100; // 0% left, 100% right
    const hsvValue = (1 - pointerPosition.y) * 100; // 100% top, 0% bottom

    const hsvColor: tinyColor.ColorFormats.HSV = {
      h: currentHue.current,
      s: hsvSaturation,
      v: hsvValue,
    };
    const hslColor = tinyColor(hsvColor).toHsl();
    onChange(hslColor);
  }, [onChange, pointerPosition]);

  const displayValue: string = useMemo(() => {
    const color = tinyColor({
      ...value.hsl,
      a: alpha,
    });

    if (selectedDisplayScheme === "hex") {
      if (isOpacityEnabled) {
        return color.toHex8String();
      }
      return color.toHexString();
    }
    if (selectedDisplayScheme === "rgba") {
      const { rgb } = value;
      if (isOpacityEnabled) {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      }
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    if (selectedDisplayScheme === "hsla") {
      const { hsl } = value;
      if (isOpacityEnabled) {
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
      }
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    return "";
  }, [isOpacityEnabled, selectedDisplayScheme, value, alpha]);

  const handleColorDisplayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      navigator.clipboard.writeText(displayValue);
      onColorDisplayClick?.(e);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      ref={shadeContainerRef}
      className={cn("relative aspect-[3/2] w-full cursor-crosshair", classNames.root)}
      style={{
        background: `linear-gradient(transparent, black), linear-gradient(to right, white, transparent), hsl(${value.hsl.h}, 100%, 50%)`,
      }}
      onClick={handleShadeContainerClick}
    >
      <div
        ref={pointerRef}
        className={cn(
          "absolute z-1 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent border-2 border-white pointer-events-none",
          classNames.pointer
        )}
        style={{
          left: `${pointerPosition.x * 100}%`,
          top: `${pointerPosition.y * 100}%`,
        }}
      />
      <button
        ref={colorDisplayRef}
        type="button"
        className={cn(
          "absolute bottom-2 left-2 flex items-center gap-1 p-1 text-sm font-medium whitespace-nowrap select-none cursor-pointer",
          classNames.colorDisplay?.root
        )}
        onClick={handleColorDisplayClick}
      >
        <Files className={cn("size-3", classNames.colorDisplay?.icon)} strokeWidth={3} />
        <span className={cn(classNames.colorDisplay?.text)}>{displayValue}</span>
      </button>
    </div>
  );
};
