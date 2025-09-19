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
    <div className={cn(classNames.root)}>
      <div className={cn("flex items-center justify-center", classNames.colorSchemePicker?.root)}>
        {COLOR_SCHEMES.map((colorScheme, index) => (
          <button
            key={colorScheme.key}
            type="button"
            className={cn(
              "capitalize text-xs font-medium cursor-pointer select-none outline-none",
              classNames.colorSchemePicker?.item,
              {
                [`${classNames.colorSchemePicker?.activeItem}`]: selectedDisplayScheme === colorScheme.key,
              }
            )}
            onClick={() => setSelectedDisplayScheme(colorScheme.key)}
          >
            {isOpacityEnabled ? colorScheme.title : colorScheme.titleWithoutOpacity}
            {index < COLOR_SCHEMES.length - 1 && (
              <span className={cn("mx-1", classNames.colorSchemePicker?.separator)}>/</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
