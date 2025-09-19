import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash-es";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsx, jsxs } from "react/jsx-runtime";
import tinyColor from "tinycolor2";
import { Files } from "lucide-react";

//#region src/constants.ts
const COLOR_SCHEMES = [
	{
		key: "rgba",
		title: "RGBA",
		titleWithoutOpacity: "RGB"
	},
	{
		key: "hex",
		title: "HEX",
		titleWithoutOpacity: "HEX"
	},
	{
		key: "hsla",
		title: "HSLA",
		titleWithoutOpacity: "HSL"
	}
];
const DEFAULT_COLOR_VALUE = "#000000";

//#endregion
//#region src/lib/common.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}

//#endregion
//#region src/components/footer.tsx
const ColorPickerFooter = (props) => {
	const { classNames, isOpacityEnabled, selectedDisplayScheme, setSelectedDisplayScheme } = props;
	return /* @__PURE__ */ jsx("div", {
		className: cn(classNames.root),
		children: /* @__PURE__ */ jsx("div", {
			className: cn("flex items-center justify-center", classNames.colorSchemePicker?.root),
			children: COLOR_SCHEMES.map((colorScheme, index) => /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: cn("capitalize text-xs font-medium cursor-pointer select-none outline-none", classNames.colorSchemePicker?.item, { [`${classNames.colorSchemePicker?.activeItem}`]: selectedDisplayScheme === colorScheme.key }),
				onClick: () => setSelectedDisplayScheme(colorScheme.key),
				children: [isOpacityEnabled ? colorScheme.title : colorScheme.titleWithoutOpacity, index < COLOR_SCHEMES.length - 1 && /* @__PURE__ */ jsx("span", {
					className: cn("mx-1", classNames.colorSchemePicker?.separator),
					children: "/"
				})]
			}, colorScheme.key))
		})
	});
};

//#endregion
//#region src/components/hue-container.tsx
const ColorPickerHueContainer = (props) => {
	const { classNames, onChange, value } = props;
	const pointerXOffset = useMemo(() => {
		const hueValue = value.hsl.h;
		return hueValue / 360;
	}, [value]);
	const [pointerXPercent, setPointerXPercent] = useState(pointerXOffset);
	const colorContainerRef = useRef(null);
	const pointerRef = useRef(null);
	const handleColorContainerClick = (e) => {
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
		const handleMouseMove = (event) => {
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
	useEffect(() => {
		const hue = Math.min(359, pointerXPercent * 360);
		onChange({
			h: hue,
			s: value.hsl.s,
			l: value.hsl.l
		});
	}, [onChange, pointerXPercent]);
	useEffect(() => {
		setPointerXPercent(pointerXOffset);
	}, [pointerXOffset]);
	return /* @__PURE__ */ jsx("div", {
		ref: colorContainerRef,
		className: cn("relative h-6 rounded-md", classNames.root),
		style: { background: "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0)" },
		onClick: handleColorContainerClick,
		children: /* @__PURE__ */ jsx("div", {
			ref: pointerRef,
			className: cn("absolute z-1 h-[95%] aspect-square -translate-x-1/2 rounded-full border-4 border-white cursor-pointer", classNames.pointer),
			style: {
				backgroundColor: `hsl(${value.hsl.h}, 100%, 50%)`,
				left: `${pointerXPercent * 100}%`
			}
		})
	});
};

//#endregion
//#region src/components/opacity-container.tsx
const ColorPickerOpacityContainer = (props) => {
	const { classNames, color, onChange, value } = props;
	const [pointerXPercent, setPointerXPercent] = useState(value * 100);
	const opacityContainerRef = useRef(null);
	const pointerRef = useRef(null);
	const handleOpacityContainerClick = (e) => {
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
		const handleMouseMove = (event) => {
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
	useEffect(() => {
		const updatedValue = Number((pointerXPercent / 100).toFixed(2));
		onChange(updatedValue);
	}, [onChange, pointerXPercent]);
	return /* @__PURE__ */ jsxs("div", {
		ref: opacityContainerRef,
		className: cn("relative h-6 rounded-md", classNames.root),
		style: {
			background: `url('/opacity-bg.jpg')`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat"
		},
		onClick: handleOpacityContainerClick,
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute z-1 inset-0 size-full rounded-md",
			style: { background: `linear-gradient(to right, hsla(${color.hsl.h}, 100%, 50%, 0), hsla(${color.hsl.h}, 100%, 50%, 1))` }
		}), /* @__PURE__ */ jsx("div", {
			ref: pointerRef,
			className: cn("absolute z-1 h-[95%] aspect-square -translate-x-1/2 rounded-full border-4 border-white cursor-pointer", classNames.pointer),
			style: {
				backgroundColor: `hsla(${color.hsl.h}, 100%, 50%, ${value})`,
				left: pointerXPercent + "%"
			}
		})]
	});
};

//#endregion
//#region src/utils.ts
/**
* @description Get the hsl scheme from the value
* @param {Value} value The value to get the hsl scheme from
* @param {boolean} isOpacityEnabled Whether the opacity is enabled
* @returns {ValueObject} The value object from the value
* @example
* getValueObjectFromValue({ hex: "#000000" }, true) // { hex: "#000000ff", rgb: { r: 0, g: 0, b: 0, a: 1 }, hsl: { h: 0, s: 0, l: 0, a: 1 }, alpha: 1 }
* getValueObjectFromValue({ hex: "#000000" }, false) // { hex: "#000000", rgb: { r: 0, g: 0, b: 0, a: 1 }, hsl: { h: 0, s: 0, l: 0, a: 1 }, alpha: 1 }
*/
const getValueObjectFromValue = (value, isOpacityEnabled) => {
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
				a: 1
			},
			hsl: {
				h: 0,
				s: 0,
				l: 0,
				a: 1
			}
		};
	}
	const rgb = color.toRgb();
	const hsl = color.toHsl();
	return {
		hex: isOpacityEnabled ? color.toHex8String() : color.toHexString(),
		rgb: {
			...rgb,
			a: Number(rgb.a.toFixed(2))
		},
		hsl: {
			h: Number(hsl.h.toFixed(0)),
			s: Number((hsl.s * 100).toFixed(0)),
			l: Number((hsl.l * 100).toFixed(0)),
			a: Number(hsl.a.toFixed(2))
		}
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
const getAlphaFromValue = (value) => {
	const color = tinyColor(value);
	const isValid = color.isValid();
	if (!isValid) {
		console.error("Color picker: invalid color received", value);
		return 1;
	}
	return Number(color.getAlpha().toFixed(2));
};

//#endregion
//#region src/components/pre-defined-colors.tsx
const ColorPickerPreDefinedColors = (props) => {
	const { classNames, colorsList, onColorClick } = props;
	const colorsSet = useMemo(() => new Set(colorsList), [colorsList]);
	if (colorsSet.size === 0) return null;
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex items-center gap-4", classNames.root),
		children: Array.from(colorsSet).map((color, index) => {
			const valueObject = getValueObjectFromValue(color, true);
			return /* @__PURE__ */ jsx("button", {
				type: "button",
				className: cn("shrink-0 size-8 rounded-full cursor-pointer outline-none hover:opacity-80 transition-opacity", classNames.item),
				style: { backgroundColor: valueObject.hex },
				onClick: () => onColorClick(valueObject)
			}, index);
		})
	});
};

//#endregion
//#region src/components/saturation-container.tsx
const ColorPickerSaturationContainer = (props) => {
	const { alpha, classNames, isOpacityEnabled, onChange, onColorDisplayClick, selectedDisplayScheme, value } = props;
	const initialPointerPosition = useMemo(() => {
		const hsvColor = tinyColor(value.hsl).toHsv();
		return {
			x: hsvColor.s,
			y: 1 - hsvColor.v
		};
	}, [value.hsl]);
	const [pointerPosition, setPointerPosition] = useState(initialPointerPosition);
	const currentHue = useRef(value.hsl.h);
	const shadeContainerRef = useRef(null);
	const pointerRef = useRef(null);
	const colorDisplayRef = useRef(null);
	useEffect(() => {
		currentHue.current = value.hsl.h;
	}, [value.hsl.h]);
	const handleShadeContainerClick = (e) => {
		const shadeContainer = shadeContainerRef.current;
		const colorDisplay = colorDisplayRef.current;
		if (!shadeContainer || !colorDisplay) return;
		if (colorDisplay.contains(e.target)) return;
		const rect = shadeContainer.getBoundingClientRect();
		const resolvedX = e.clientX - rect.left;
		const resolvedY = e.clientY - rect.top;
		const percentX = Math.max(0, Math.min(1, resolvedX / rect.width));
		const percentY = Math.max(0, Math.min(1, resolvedY / rect.height));
		setPointerPosition({
			x: percentX,
			y: percentY
		});
	};
	useEffect(() => {
		const shadeContainer = shadeContainerRef.current;
		const pointer = pointerRef.current;
		if (!shadeContainer || !pointer) return;
		const handleMouseMove = (event) => {
			const rect = shadeContainer.getBoundingClientRect();
			const resolvedX = event.clientX - rect.left;
			const resolvedY = event.clientY - rect.top;
			const percentX = Math.max(0, Math.min(1, resolvedX / rect.width));
			const percentY = Math.max(0, Math.min(1, resolvedY / rect.height));
			setPointerPosition({
				x: percentX,
				y: percentY
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
		const hsvSaturation = pointerPosition.x * 100;
		const hsvValue = (1 - pointerPosition.y) * 100;
		const hsvColor = {
			h: currentHue.current,
			s: hsvSaturation,
			v: hsvValue
		};
		const hslColor = tinyColor(hsvColor).toHsl();
		onChange(hslColor);
	}, [onChange, pointerPosition]);
	const displayValue = useMemo(() => {
		const color = tinyColor({
			...value.hsl,
			a: alpha
		});
		if (selectedDisplayScheme === "hex") {
			if (isOpacityEnabled) return color.toHex8String();
			return color.toHexString();
		}
		if (selectedDisplayScheme === "rgba") {
			const { rgb } = value;
			if (isOpacityEnabled) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
			return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
		}
		if (selectedDisplayScheme === "hsla") {
			const { hsl } = value;
			if (isOpacityEnabled) return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
			return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
		}
		return "";
	}, [
		isOpacityEnabled,
		selectedDisplayScheme,
		value,
		alpha
	]);
	const handleColorDisplayClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			navigator.clipboard.writeText(displayValue);
			onColorDisplayClick?.(e);
		} catch (error) {
			console.error(error);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: shadeContainerRef,
		className: cn("relative aspect-[3/2] w-full cursor-crosshair", classNames.root),
		style: { background: `linear-gradient(transparent, black), linear-gradient(to right, white, transparent), hsl(${value.hsl.h}, 100%, 50%)` },
		onClick: handleShadeContainerClick,
		children: [/* @__PURE__ */ jsx("div", {
			ref: pointerRef,
			className: cn("absolute z-1 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent border-2 border-white pointer-events-none", classNames.pointer),
			style: {
				left: `${pointerPosition.x * 100}%`,
				top: `${pointerPosition.y * 100}%`
			}
		}), /* @__PURE__ */ jsxs("button", {
			ref: colorDisplayRef,
			type: "button",
			className: cn("absolute bottom-2 left-2 flex items-center gap-1 p-1 text-sm font-medium whitespace-nowrap select-none cursor-pointer", classNames.colorDisplay?.root),
			onClick: handleColorDisplayClick,
			children: [/* @__PURE__ */ jsx(Files, {
				className: cn("size-3", classNames.colorDisplay?.icon),
				strokeWidth: 3
			}), /* @__PURE__ */ jsx("span", {
				className: cn(classNames.colorDisplay?.text),
				children: displayValue
			})]
		})]
	});
};

//#endregion
//#region src/components/root.tsx
const ColorPicker = (props) => {
	const { classNames = {}, debounceTime = 100, hideOpacityPicker = false, onChange, onColorDisplayClick, predefinedColors = [], value = DEFAULT_COLOR_VALUE } = props;
	const [color, setColor] = useState(getValueObjectFromValue(value, !hideOpacityPicker));
	const [alpha, setAlpha] = useState(getAlphaFromValue(value));
	const [selectedDisplayScheme, setSelectedDisplayScheme] = useState("hex");
	const debouncedOnChange = useCallback(debounce((value$1) => {
		onChange?.(value$1);
	}, debounceTime), [debounceTime, onChange]);
	useEffect(() => {
		const valueObject = getValueObjectFromValue({
			...color.hsl,
			a: alpha
		}, !hideOpacityPicker);
		debouncedOnChange(valueObject);
	}, [
		color,
		alpha,
		debouncedOnChange,
		hideOpacityPicker
	]);
	const handleColorChange = useCallback((value$1) => {
		const valueObject = getValueObjectFromValue(value$1, !hideOpacityPicker);
		setColor(valueObject);
	}, [hideOpacityPicker]);
	const handleAlphaChange = useCallback((value$1) => {
		setAlpha(value$1);
	}, []);
	const handlePreDefinedColorClick = useCallback((value$1) => {
		const hslValue = {
			h: value$1.hsl.h,
			s: value$1.hsl.s,
			l: value$1.hsl.l
		};
		setColor(getValueObjectFromValue(hslValue, !hideOpacityPicker));
	}, [hideOpacityPicker]);
	return /* @__PURE__ */ jsxs("div", {
		className: cn("w-72 space-y-6", classNames.root),
		children: [
			/* @__PURE__ */ jsx(ColorPickerSaturationContainer, {
				alpha,
				classNames: classNames.saturationContainer ?? {},
				isOpacityEnabled: !hideOpacityPicker,
				onChange: handleColorChange,
				onColorDisplayClick,
				selectedDisplayScheme,
				value: color
			}),
			/* @__PURE__ */ jsx(ColorPickerHueContainer, {
				classNames: classNames.colorContainer ?? {},
				onChange: handleColorChange,
				value: color
			}),
			!hideOpacityPicker && /* @__PURE__ */ jsx(ColorPickerOpacityContainer, {
				classNames: classNames.opacityContainer ?? {},
				color,
				onChange: handleAlphaChange,
				value: alpha
			}),
			/* @__PURE__ */ jsx(ColorPickerPreDefinedColors, {
				classNames: classNames.predefinedColorsContainer ?? {},
				colorsList: predefinedColors,
				onColorClick: handlePreDefinedColorClick
			}),
			/* @__PURE__ */ jsx(ColorPickerFooter, {
				classNames: classNames.footer ?? {},
				isOpacityEnabled: !hideOpacityPicker,
				selectedDisplayScheme,
				setSelectedDisplayScheme
			})
		]
	});
};

//#endregion
//#region src/index.ts
var src_default = ColorPicker;

//#endregion
export { COLOR_SCHEMES, ColorPicker, src_default as default, getAlphaFromValue, getValueObjectFromValue };