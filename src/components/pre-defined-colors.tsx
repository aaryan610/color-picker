import { useMemo } from "react";
// local imports
import { cn } from "../lib/common";
import type { PreDefinedColorsContainerClassNames, Value, ValueObject } from "../types";
import { getValueObjectFromValue } from "../utils";

type Props = {
  classNames: PreDefinedColorsContainerClassNames;
  colorsList: Value[];
  onColorClick: (color: ValueObject) => void;
};

export const ColorPickerPreDefinedColors: React.FC<Props> = (props) => {
  const { classNames, colorsList, onColorClick } = props;
  // remove duplicates
  const colorsSet = useMemo(() => new Set(colorsList), [colorsList]);

  if (colorsSet.size === 0) return null;

  return (
    <div className={cn("flex items-center gap-4", classNames.root)}>
      {Array.from(colorsSet).map((color, index) => {
        const valueObject = getValueObjectFromValue(color, true);

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "shrink-0 size-8 rounded-full cursor-pointer outline-none hover:opacity-80 transition-opacity",
              classNames.item
            )}
            style={{
              backgroundColor: valueObject.hex,
            }}
            onClick={() => onColorClick(valueObject)}
          />
        );
      })}
    </div>
  );
};
