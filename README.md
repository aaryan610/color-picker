# @aaryan610/color-picker

A modern, customizable React color picker component with full HSL/HSV support, opacity controls, and multiple color format outputs.

## Features

- **Multiple Color Formats**: Support for HEX, RGB/RGBA, and HSL/HSLA
- **HSV Color Space**: Intuitive saturation and brightness selection
- **Opacity Control**: Optional alpha channel support
- **Predefined Colors**: Customizable color palette
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety and IntelliSense support
- **Tailwind CSS**: Styled with Tailwind for easy customization
- **Zero Dependencies**: Only requires React and a few utility libraries

## Installation

```bash
npm install @aaryan610/color-picker
```

```bash
yarn add @aaryan610/color-picker
```

```bash
pnpm add @aaryan610/color-picker
```

## Basic Usage

```tsx
import { ColorPicker } from "@aaryan610/color-picker";

function App() {
  const handleColorChange = (color) => {
    console.log("Selected color:", color);
  };

  return (
    <div>
      <ColorPicker value={{ hex: "#ff0000" }} onChange={handleColorChange} />
    </div>
  );
}
```

## Advanced Usage

```tsx
import { ColorPicker } from "@aaryan610/color-picker";

function App() {
  const [color, setColor] = useState({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246, a: 1 },
    hsl: { h: 217, s: 91, l: 60, a: 1 },
  });

  const predefinedColors = [
    { hex: "#ff0000", rgb: { r: 255, g: 0, b: 0 }, hsl: { h: 0, s: 100, l: 50 } },
    { hex: "#00ff00", rgb: { r: 0, g: 255, b: 0 }, hsl: { h: 120, s: 100, l: 50 } },
    { hex: "#0000ff", rgb: { r: 0, g: 0, b: 255 }, hsl: { h: 240, s: 100, l: 50 } },
  ];

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      predefinedColors={predefinedColors}
      hideOpacityPicker={false}
      debounceTime={150}
      onColorDisplayClick={(e) => {
        console.log("Color copied to clipboard!");
      }}
      classNames={{
        root: "custom-color-picker",
        shadeContainer: {
          root: "custom-shade-container",
          pointer: "custom-pointer",
        },
      }}
    />
  );
}
```

## API Reference

### ColorPicker Props

| Prop                  | Type                           | Default              | Description                              |
| --------------------- | ------------------------------ | -------------------- | ---------------------------------------- |
| `value`               | `ValueObject`                  | `{ hex: '#000000' }` | Current color value                      |
| `onChange`            | `(color: ValueObject) => void` | -                    | Callback fired when color changes        |
| `predefinedColors`    | `ValueObject[]`                | `[]`                 | Array of predefined colors to display    |
| `hideOpacityPicker`   | `boolean`                      | `false`              | Hide the opacity/alpha slider            |
| `debounceTime`        | `number`                       | `100`                | Debounce time for onChange callback (ms) |
| `onColorDisplayClick` | `(e: MouseEvent) => void`      | -                    | Callback when color display is clicked   |
| `classNames`          | `ColorPickerClassNames`        | `{}`                 | Custom CSS classes for styling           |

### Value Object

```typescript
type ValueObject {
  hex: string; // '#ff0000'
  rgb: {
    // RGB values
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
    a: number; // 0-1
  };
  hsl: {
    // HSL values
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
    a: number; // 0-1
  };
}
```

### Custom Styling

The component accepts custom class names for full styling control:

```typescript
type ColorPickerClassNames {
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
  colorContainer?: {
    colorContainer?: string;
    pointer?: string;
  };
  opacityContainer?: {
    root?: string;
    pointer?: string;
  };
  predefinedColorsContainer?: {
    root?: string;
    color?: string;
  };
  footer?: {
    root?: string;
    button?: string;
  };
}
```

## Color Formats

The color picker supports multiple output formats that are automatically synchronized:

- **HEX**: `#ff0000` or `#ff0000ff` (with alpha)
- **RGB**: `rgb(255, 0, 0)` or `rgba(255, 0, 0, 1)`
- **HSL**: `hsl(0, 100%, 50%)` or `hsla(0, 100%, 50%, 1)`

## Browser Support

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
