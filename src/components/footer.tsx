import React from "react";
// local imports
import { COLOR_SCHEMES } from "../constants";
import { cn } from "../lib/common";
import type { ColorScheme, FooterClassNames } from "../types";

type Props = {
  classNames: FooterClassNames;
  isOpacityEnabled: boolean;
  selectedDisplayScheme: ColorScheme;
  setSelectedDisplayScheme: (colorScheme: ColorScheme) => void;
};

export const ColorPickerFooter: React.FC<Props> = (props) => {
  const { classNames, isOpacityEnabled, selectedDisplayScheme, setSelectedDisplayScheme } = props;

  return (
    <div className={cn("border-t border-zinc-700 pt-4", classNames.root)}>
      <div className={cn("flex items-center justify-center", classNames.colorSchemePicker?.root)}>
        {COLOR_SCHEMES.map((colorScheme, index) => (
          <button
            key={colorScheme.key}
            type="button"
            className={cn(
              "capitalize text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium cursor-pointer select-none outline-none",
              classNames.colorSchemePicker?.item,
              {
                [`text-white hover:text-white ${classNames.colorSchemePicker?.activeItem}`]:
                  selectedDisplayScheme === colorScheme.key,
              }
            )}
            onClick={() => setSelectedDisplayScheme(colorScheme.key)}
          >
            {isOpacityEnabled ? colorScheme.title : colorScheme.titleWithoutOpacity}
            {index < COLOR_SCHEMES.length - 1 && (
              <span className={cn("mx-1 text-zinc-500", classNames.colorSchemePicker?.separator)}>/</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
