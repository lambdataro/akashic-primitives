/**
 * RGBAの各要素がそれぞれ8bitで表された色。
 * この型が指定されている関数は事前条件として配列の長さが4であることが要請される
 */
export type Uint8Color = Uint8ClampedArray;

/**
 * Uint8ColorをcssColorに変換する
 *
 * @param color 色
 */
export function toCssColor(color: Uint8Color): string {
	/* eslint-disable @typescript-eslint/ban-ts-comment */

	// @ts-ignore
	const r = color[0];
	// @ts-ignore
	const g = color[1];
	// @ts-ignore
	const b = color[2];
	// @ts-ignore
	const a = color[3] / 255;

	return `rgba(${r},${g},${b},${a})`;

	/* eslint-enable @typescript-eslint/ban-ts-comment */
}

/**
 * RGBAから色を作る
 *
 * @param r 赤[0.0-1.0]
 * @param g 緑[0.0-1.0]
 * @param b 青[0.0-1.0]
 * @param a アルファ[0.0-1.0]
 */
export function rgba(r: number, g: number, b: number, a: number): Uint8Color {
	return new Uint8ClampedArray([r * 255, g * 255, b * 255, a * 255]);
}

/**
 * RGBから色を作る
 *
 * @param r 赤[0.0-1.0]
 * @param g 緑[0.0-1.0]
 * @param b 青[0.0-1.0]
 */
export function rgb(r: number, g: number, b: number): Uint8Color {
	return rgba(r, g, b, 1.0);
}

/**
 * HSVAから色を作る
 *
 * @param h 色相[0.0-1.0]
 * @param s 彩度[0.0-1.0]
 * @param v 明度[0.0-1.0]
 * @param a アルファ[0.0-1.0]
 */
export function hsva(h: number, s: number, v: number, a: number): Uint8Color {
	// 参考: https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93
	let r = v;
	let g = v;
	let b = v;
	if (s > 0) {
		h *= 6;
		const i = Math.floor(h);
		const f = h - i;
		switch (i) {
			default:
			case 0:
				g *= 1 - s * (1 - f);
				b *= 1 - s;
				break;
			case 1:
				r *= 1 - s * f;
				b *= 1 - s;
				break;
			case 2:
				r *= 1 - s;
				b *= 1 - s * (1 - f);
				break;
			case 3:
				r *= 1 - s;
				g *= 1 - s * f;
				break;
			case 4:
				r *= 1 - s * (1 - f);
				g *= 1 - s;
				break;
			case 5:
				g *= 1 - s;
				b *= 1 - s * f;
				break;
		}
	}
	return rgba(r, g, b, a);
}

/**
 * HSVから色を作る
 *
 * @param h 色相[0.0-1.0]
 * @param s 彩度[0.0-1.0]
 * @param v 明度[0.0-1.0]
 */
export function hsv(h: number, s: number, v: number): Uint8Color {
	return hsva(h, s, v, 1.0);
}

/**
 * HSLAから色を作る
 *
 * @param h 色相[0.0-1.0]
 * @param s 彩度[0.0-1.0]
 * @param l 輝度[0.0-1.0]
 * @param a アルファ[0.0-1.0]
 */
export function hsla(h: number, s: number, l: number, a: number): Uint8Color {
	// 参考: https://www.w3.org/TR/css-color-4/#hsl-to-rgb
	const t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
	const t1 = l * 2 - t2;

	const toRgb = (t1: number, t2: number, hue: number): number => {
		if (hue < 0) hue += 6;
		if (hue >= 6) hue -= 6;

		if (hue < 1) return (t2 - t1) * hue + t1;
		else if (hue < 3) return t2;
		else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
		else return t1;
	};

	return rgba(toRgb(t1, t2, h * 6 + 2), toRgb(t1, t2, h * 6), toRgb(t1, t2, h * 6 - 2), a);
}

/**
 * HSLから色を作る
 *
 * @param h 色相[0.0-1.0]
 * @param s 彩度[0.0-1.0]
 * @param l 輝度[0.0-1.0]
 */
export function hsl(h: number, s: number, l: number): Uint8Color {
	return hsla(h, s, l, 1.0);
}
