# react-neat-color-picker

A modern, customizable React color picker component with full HSL/HSV support, opacity controls, and multiple color format outputs.

## Features

- **Multiple color formats**: Support for HEX, RGB/RGBA, and HSL/HSLA
- **HSV color space**: Intuitive saturation and brightness selection
- **Opacity control**: Optional alpha channel support
- **Predefined colors**: Customizable color palette for quick access to some predefined colors
- **Accessible**: Works on desktop and mobile devices
- **TypeScript**: Full type safety and IntelliSense support
- **Tailwind CSS**: Styled with Tailwind for easy customization
- **Zero dependencies**: Only requires React and a few utility libraries

## Installation

```bash
npm install react-neat-color-picker
```

```bash
yarn add react-neat-color-picker
```

```bash
pnpm add react-neat-color-picker
```

## Basic usage

```tsx
import { ColorPicker } from "react-neat-color-picker";

function App() {
  const handleColorChange = (color) => {
    console.log("Selected color:", color);
  };

  return (
    <div>
      <ColorPicker value="#ff0000" onChange={handleColorChange} />
    </div>
  );
}
```

## Advanced usage

```tsx
import { ColorPicker } from "react-neat-color-picker";

function App() {
  const [color, setColor] = useState("#3b82f6");

  const predefinedColors = [{ hex: "#ff0000" }, { rgb: { r: 0, g: 255, b: 0 } }, { hsl: { h: 240, s: 100, l: 50 } }];

  return (
    <ColorPicker
      value={color}
      onChange={(val) => setColor(val.hex)}
      predefinedColors={predefinedColors}
      hideOpacityPicker={false}
      debounceTime={150}
      onColorDisplayClick={() => alert("Color copied to clipboard!")}
      classNames={{
        root: "custom-color-picker",
        saturationContainer: {
          root: "custom-saturation-container",
          pointer: "custom-pointer",
        },
      }}
    />
  );
}
```

## API reference

### ColorPicker props

| Prop                  | Type                           | Default     | Description                              |
| --------------------- | ------------------------------ | ----------- | ---------------------------------------- |
| `value`               | `Value`                        | `'#000000'` | Current color value                      |
| `onChange`            | `(color: ValueObject) => void` | -           | Callback fired when color changes        |
| `predefinedColors`    | `Value[]`                      | `[]`        | Array of predefined colors to display    |
| `hideOpacityPicker`   | `boolean`                      | `false`     | Hide the opacity/alpha slider            |
| `debounceTime`        | `number`                       | `100`       | Debounce time for onChange callback (ms) |
| `onColorDisplayClick` | `(e: MouseEvent) => void`      | -           | Callback when color display is clicked   |
| `classNames`          | `ColorPickerClassNames`        | `{}`        | Custom CSS classes for styling           |

### Types

```typescript
// The initial value to load the color picker with
type Value = string | ValueRGB | ValueHSL;

// The argument type for the onChange callback
type ValueObject = {
  hex: string;
  rgb: ValueRGB;
  hsl: ValueHSL;
};

type ValueRGB = {
  r: number;
  g: number;
  b: number;
  // The alpha value of the color from 0 to 1
  a?: number;
};

type ValueHSL = {
  h: number;
  s: number;
  l: number;
  // The alpha value of the color from 0 to 1
  a?: number;
};
```

### Custom styling

The component accepts custom class names for full styling control:

```typescript
type ColorPickerClassNames = {
  root?: string;
  saturationContainer?: {
    root?: string;
    pointer?: string;
    colorDisplay?: {
      root?: string;
      icon?: string;
      text?: string;
    };
  };
  hueContainer?: {
    root?: string;
    pointer?: string;
  };
  opacityContainer?: {
    root?: string;
    pointer?: string;
  };
  predefinedColorsContainer?: {
    root?: string;
    item?: string;
  };
  footer?: {
    root?: string;
    colorSchemePicker?: {
      root?: string;
      item?: string;
      activeItem?: string;
      separator?: string;
    };
  };
};
```

## Color formats

The color picker supports multiple output formats that are automatically synchronized:

- **HEX**: `#ff0000` or `#ff0000ff` (with alpha)
- **RGB**: `rgb(255, 0, 0)` or `rgba(255, 0, 0, 1)`
- **HSL**: `hsl(0, 100%, 50%)` or `hsla(0, 100%, 50%, 1)`

## Browser support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+
- React 16.8+ (hooks support required)

## Styling

This component uses Tailwind CSS classes. If you're not using Tailwind in your project, you'll need to either:

1. Include Tailwind CSS in your project
2. Provide custom styles via the `classNames` prop
3. Override the default styles with your own CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 0.1.0

- Initial release
- Multiple color format outputs
- Opacity controls
- Predefined colors
- TypeScript support
