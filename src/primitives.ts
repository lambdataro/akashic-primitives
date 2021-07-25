import { Uint8Color } from "./color";

/**
 * ES2015のtrunc関数
 */
function trunc(v: number): number {
	return v < 0 ? Math.ceil(v) : Math.floor(v);
}

/**
 * ピクセルを描く
 *
 * @param renderer 描画するRenderer
 * @param x X座標
 * @param y Y座標
 * @param rgba 色
 */
export function pixel(renderer: g.Renderer, x: number, y: number, rgba: Uint8Color): void {
	x = trunc(x);
	y = trunc(y);

	const imageData = renderer._getImageData(x, y, 1, 1);
	if (!imageData) {
		return;
	}

	imageData.data.set(rgba, 0);
	renderer._putImageData(imageData, x, y);
}

/**
 * 水平線を描く
 *
 * 終点(x2,y)も描画される
 *
 * @param renderer 描画するRenderer
 * @param x1 始点(左端)のX座標
 * @param x2 終点(右側)のX座標
 * @param y Y座標
 * @param rgba 色
 */
export function hline(renderer: g.Renderer, x1: number, x2: number, y: number, rgba: Uint8Color): void {
	x1 = trunc(x1);
	x2 = trunc(x2);
	y = trunc(y);

	// Swap x1, x2 if required
	if (x1 > x2) {
		[x1, x2] = [x2, x1];
	}

	const length = x2 - x1 + 1;
	const imageData = renderer._getImageData(x1, y, length, 1);
	if (!imageData) {
		return;
	}

	let idx = 0;
	for (let i = 0; i < length; i++) {
		imageData.data.set(rgba, idx);
		idx += 4;
	}
	renderer._putImageData(imageData, x1, y);
}

/**
 * 垂直線を描く
 *
 * 終点(x,y2)も描画される
 *
 * @param renderer 描画するRenderer
 * @param x X座標
 * @param y1 始点(上端)のY座標
 * @param y2 終点(下端)のY座標
 * @param rgba 色
 * @returns
 */
export function vline(renderer: g.Renderer, x: number, y1: number, y2: number, rgba: Uint8Color) {
	x = trunc(x);
	y1 = trunc(y1);
	y2 = trunc(y2);

	// Swap y1, y2 if required
	if (y1 > y2) {
		[y1, y2] = [y2, y1];
	}

	const length = y2 - y1 + 1;
	const imageData = renderer._getImageData(x, y1, 1, length);
	if (!imageData) return;

	let idx = 0;
	for (let i = 0; i < length; i++) {
		imageData.data.set(rgba, idx);
		idx += 4;
	}
	renderer._putImageData(imageData, x, y1);
}

/**
 * 線を描く
 *
 * 終点(x2,y2)も描画される
 *
 * @param renderer 描画するRenderer
 * @param x1 始点のX座標
 * @param y1 始点のY座標
 * @param x2 終点のX座標
 * @param y2 終点のY座標
 * @param rgba 色
 */
export function line(renderer: g.Renderer, x1: number, y1: number, x2: number, y2: number, rgba: Uint8Color): void {
	// この関数はSDL_gfxのAlpha blending時のアルゴリズムを元にしています。

	x1 = trunc(x1);
	x2 = trunc(x2);
	y1 = trunc(y1);
	y2 = trunc(y2);

	if (x1 === x2) {
		if (y1 === y2) {
			pixel(renderer, x1, y1, rgba);
			return;
		} else {
			vline(renderer, x1, y1, y2, rgba);
			return;
		}
	} else {
		if (y1 === y2) {
			hline(renderer, x1, x2, y1, rgba);
			return;
		}
	}

	const minX = Math.min(x1, x2);
	const maxX = Math.max(x1, x2);
	const minY = Math.min(y1, y2);
	const maxY = Math.max(y1, y2);

	const width = maxX - minX + 1;
	const height = maxY - minY + 1;
	const imageData = renderer._getImageData(minX, minY, width, height);
	if (!imageData) return;

	const drawPixel = (px: number, py: number) => {
		const dx = px - minX;
		const dy = py - minY;
		const idx = dy * imageData.width + dx;
		imageData.data.set(rgba, idx * 4);
	};

	const dx = x2 - x1;
	const dy = y2 - y1;
	const sx = dx >= 0 ? 1 : -1;
	const sy = dy >= 0 ? 1 : -1;
	const ax = Math.abs(dx) << 1;
	const ay = Math.abs(dy) << 1;
	let x = x1;
	let y = y1;
	if (ax > ay) {
		let d = ay - (ax >> 1);
		while (x !== x2) {
			drawPixel(x, y);
			if (d > 0 || (d === 0 && sx === 1)) {
				y += sy;
				d -= ax;
			}
			x += sx;
			d += ay;
		}
	} else {
		let d = ax - (ay >> 1);
		while (y !== y2) {
			drawPixel(x, y);
			if (d > 0 || (d === 0 && sy === 1)) {
				x += sx;
				d -= ay;
			}
			y += sy;
			d += ax;
		}
	}
	drawPixel(x, y);

	renderer._putImageData(imageData, minX, minY);
}

/**
 * 長方形を描く
 *
 * @param renderer 描画するRenderer
 * @param x1 始点のX座標
 * @param y1 始点のY座標
 * @param x2 終点のX座標
 * @param y2 終点のY座標
 * @param rgba 色
 */
export function rectangle(
	renderer: g.Renderer,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	rgba: Uint8Color
): void {
	x1 = trunc(x1);
	x2 = trunc(x2);
	y1 = trunc(y1);
	y2 = trunc(y2);

	if (x1 === x2) {
		if (y1 === y2) {
			pixel(renderer, x1, y1, rgba);
			return;
		} else {
			vline(renderer, x1, y1, y2, rgba);
			return;
		}
	} else {
		if (y1 === y2) {
			hline(renderer, x1, x2, y1, rgba);
			return;
		}
	}

	// 必要に応じてx1,x2を入れ替え
	if (x1 > x2) {
		[x1, x2] = [x2, x1];
	}

	// 必要に応じてy1,y2を入れ替え
	if (y1 > y2) {
		[y1, y2] = [y2, y1];
	}

	// 長方形を描く
	hline(renderer, x1, x2, y1, rgba); // 上
	hline(renderer, x1, x2, y2, rgba); // 下
	y1 += 1;
	y2 -= 1;
	if (y1 <= y2) {
		vline(renderer, x1, y1, y2, rgba); // 左
		vline(renderer, x2, y1, y2, rgba); // 右
	}
}

/**
 * 塗りつぶした長方形を描く
 *
 * @param renderer 描画するRenderer
 * @param x1 始点のX座標
 * @param y1 始点のY座標
 * @param x2 終点のX座標
 * @param y2 終点のY座標
 * @param rgba 色
 */
export function box(renderer: g.Renderer, x1: number, y1: number, x2: number, y2: number, rgba: Uint8Color): void {
	x1 = trunc(x1);
	x2 = trunc(x2);
	y1 = trunc(y1);
	y2 = trunc(y2);

	if (x1 === x2) {
		if (y1 === y2) {
			pixel(renderer, x1, y1, rgba);
			return;
		} else {
			vline(renderer, x1, y1, y2, rgba);
			return;
		}
	} else {
		if (y1 === y2) {
			hline(renderer, x1, x2, y1, rgba);
			return;
		}
	}

	// 必要に応じてx1,x2を入れ替え
	if (x1 > x2) {
		[x1, x2] = [x2, x1];
	}

	// 必要に応じてy1,y2を入れ替え
	if (y1 > y2) {
		[y1, y2] = [y2, y1];
	}

	const width = x2 - x1 + 1;
	const height = y2 - y1 + 1;

	const imageData = renderer._getImageData(x1, y1, width, height);
	if (!imageData) return;

	let idx = 0;
	for (let i = 0; i < width * height; i++) {
		imageData.data.set(rgba, idx);
		idx += 4;
	}
	renderer._putImageData(imageData, x1, y1);
}

/**
 * 楕円を描画
 *
 * @param renderer 描画するRenderer
 * @param x 中心のX座標
 * @param y 中心のY座標
 * @param rx X方向の半径
 * @param ry Y方向の半径
 * @param rgba 色
 */
export function ellipse(renderer: g.Renderer, x: number, y: number, rx: number, ry: number, rgba: Uint8Color): void {
	x = trunc(x);
	y = trunc(y);
	rx = trunc(rx);
	ry = trunc(ry);

	// Sanity check radii
	if (rx < 0) {
		throw new Error("invalid parameter: rx");
	}
	if (ry < 0) {
		throw new Error("invalid parameter: ry");
	}

	// Special case for rx=0 - draw a vline
	if (rx === 0) {
		vline(renderer, x, y - ry, y + ry, rgba);
		return;
	}
	// Special case for ry=0 - draw a hline
	if (ry === 0) {
		hline(renderer, x - rx, x + rx, y, rgba);
		return;
	}

	const width = rx * 2 + 1;
	const height = ry * 2 + 1;
	const minX = x - rx;
	const minY = y - ry;

	const imageData = renderer._getImageData(minX, minY, width, height);
	if (!imageData) return;

	const drawPixel = (px: number, py: number) => {
		const dx = px - minX;
		const dy = py - minY;
		const idx = dy * imageData.width + dx;
		imageData.data.set(rgba, idx * 4);
	};

	// Draw
	let h = 0;
	let i = 0;
	if (rx > ry) {
		let oj = 0xffff;
		let ok = 0xffff;
		let ix = 0;
		let iy = rx * 64;

		do {
			h = (ix + 32) >> 6;
			i = (iy + 32) >> 6;
			const j = trunc((h * ry) / rx);
			const k = trunc((i * ry) / rx);

			if ((ok != k && oj != k) || (oj != j && ok != j) || k != j) {
				const xph = x + h;
				const xmh = x - h;
				if (k > 0) {
					const ypk = y + k;
					const ymk = y - k;
					drawPixel(xmh, ypk);
					drawPixel(xph, ypk);
					drawPixel(xmh, ymk);
					drawPixel(xph, ymk);
				} else {
					drawPixel(xmh, y);
					drawPixel(xph, y);
				}
				ok = k;
				const xpi = x + i;
				const xmi = x - i;
				if (j > 0) {
					const ypj = y + j;
					const ymj = y - j;
					drawPixel(xmi, ypj);
					drawPixel(xpi, ypj);
					drawPixel(xmi, ymj);
					drawPixel(xpi, ymj);
				} else {
					drawPixel(xmi, y);
					drawPixel(xpi, y);
				}
				oj = j;
			}
			ix = trunc(ix + iy / rx);
			iy = trunc(iy - ix / rx);
		} while (i > h);
	} else {
		let oh = 0xffff;
		let oi = 0xffff;
		let ix = 0;
		let iy = ry * 64;
		do {
			h = (ix + 32) >> 6;
			i = (iy + 32) >> 6;
			const j = trunc((h * rx) / ry);
			const k = trunc((i * rx) / ry);

			if ((oi !== i && oh !== i) || (oh !== h && oi !== h && i !== h)) {
				const xmj = x - j;
				const xpj = x + j;
				if (i > 0) {
					const ypi = y + i;
					const ymi = y - i;
					drawPixel(xmj, ypi);
					drawPixel(xpj, ypi);
					drawPixel(xmj, ymi);
					drawPixel(xpj, ymi);
				} else {
					drawPixel(xmj, y);
					drawPixel(xpj, y);
				}
				oi = i;
				const xmk = x - k;
				const xpk = x + k;
				if (h > 0) {
					const yph = y + h;
					const ymh = y - h;
					drawPixel(xmk, yph);
					drawPixel(xpk, yph);
					drawPixel(xmk, ymh);
					drawPixel(xpk, ymh);
				} else {
					drawPixel(xmk, y);
					drawPixel(xpk, y);
				}
				oh = h;
			}
			ix = trunc(ix + iy / ry);
			iy = trunc(iy - ix / ry);
		} while (i > h);
	}

	renderer._putImageData(imageData, minX, minY);
}

/**
 * 円を描画
 *
 * @param renderer 描画するRenderer
 * @param x 中心のX座標
 * @param y X方向の半径
 * @param rad 半径
 * @param rgba 色
 */
export function circle(renderer: g.Renderer, x: number, y: number, rad: number, rgba: Uint8Color): void {
	ellipse(renderer, x, y, rad, rad, rgba);
}

/**
 * 塗りつぶした楕円を描画
 *
 * @param renderer 描画するRenderer
 * @param x 中心のX座標
 * @param y 中心のY座標
 * @param rx X方向の半径
 * @param ry Y方向の半径
 * @param rgba 色
 */
export function filledEllipse(
	renderer: g.Renderer,
	x: number,
	y: number,
	rx: number,
	ry: number,
	rgba: Uint8Color
): void {
	x = trunc(x);
	y = trunc(y);
	rx = trunc(rx);
	ry = trunc(ry);

	// Sanity check radii
	if (rx < 0) {
		throw new Error("invalid parameter: rx");
	}
	if (ry < 0) {
		throw new Error("invalid parameter: ry");
	}

	// Special case for rx=0 - draw a vline
	if (rx === 0) {
		vline(renderer, x, y - ry, y + ry, rgba);
		return;
	}
	// Special case for ry=0 - draw a hline
	if (ry === 0) {
		hline(renderer, x - rx, x + rx, y, rgba);
		return;
	}

	const width = rx * 2 + 1;
	const height = ry * 2 + 1;
	const minX = x - rx;
	const minY = y - ry;

	const imageData = renderer._getImageData(minX, minY, width, height);
	if (!imageData) return;

	const drawHline = (px1: number, px2: number, py: number) => {
		const dx = px1 - minX;
		const dy = py - minY;
		const length = px2 - px1 + 1;
		let idx = (dy * imageData.width + dx) * 4;
		for (let i = 0; i < length; i++) {
			imageData.data.set(rgba, idx);
			idx += 4;
		}
	};

	// Draw

	let h = 0;
	let i = 0;
	if (rx > ry) {
		let oj = 0xffff;
		let ok = 0xffff;
		let ix = 0;
		let iy = rx * 64;

		do {
			h = (ix + 32) >> 6;
			i = (iy + 32) >> 6;
			const j = trunc((h * ry) / rx);
			const k = trunc((i * ry) / rx);

			if (ok !== k && oj !== k) {
				const xph = x + h;
				const xmh = x - h;
				if (k > 0) {
					drawHline(xmh, xph, y + k);
					drawHline(xmh, xph, y - k);
				} else {
					drawHline(xmh, xph, y);
				}
				ok = k;
			}
			if (oj !== j && ok !== j && k !== j) {
				const xpi = x + i;
				const xmi = x - i;
				if (j > 0) {
					drawHline(xmi, xpi, y + j);
					drawHline(xmi, xpi, y - j);
				} else {
					drawHline(xmi, xpi, y);
				}
				oj = j;
			}
			ix = trunc(ix + iy / rx);
			iy = trunc(iy - ix / rx);
		} while (i > h);
	} else {
		let oh = 0xffff;
		let oi = 0xffff;
		let ix = 0;
		let iy = ry * 64;
		do {
			h = (ix + 32) >> 6;
			i = (iy + 32) >> 6;
			const j = trunc((h * rx) / ry);
			const k = trunc((i * rx) / ry);

			if (oi !== i && oh !== i) {
				const xmj = x - j;
				const xpj = x + j;
				if (i > 0) {
					drawHline(xmj, xpj, y + i);
					drawHline(xmj, xpj, y - i);
				} else {
					drawHline(xmj, xpj, y);
				}
				oi = i;
			}
			if (oh !== h && oi !== h && i !== h) {
				const xmk = x - k;
				const xpk = x + k;
				if (h > 0) {
					drawHline(xmk, xpk, y + h);
					drawHline(xmk, xpk, y - h);
				} else {
					drawHline(xmk, xpk, y);
				}
				oh = h;
			}
			ix = trunc(ix + iy / ry);
			iy = trunc(iy - ix / ry);
		} while (i > h);
	}

	renderer._putImageData(imageData, minX, minY);
}

/**
 * 塗りつぶした円を描画
 *
 * @param renderer 描画するRenderer
 * @param x 中心のX座標
 * @param y 中心のY座標
 * @param rad 半径
 * @param rgba 色
 */
export function filledCircle(renderer: g.Renderer, x: number, y: number, rad: number, rgba: Uint8Color): void {
	filledEllipse(renderer, x, y, rad, rad, rgba);
}

/**
 * 円弧を描く
 *
 * @param renderer 描画するRenderer
 * @param x 円弧の中心のX座標
 * @param y 円弧の中心のY座標
 * @param rad 円弧の半径
 * @param start 開始角度の度数。0度の場合は右端。時計回りに増える。
 * @param end 終了角度の度数。0度の場合は右端。時計回りに増える。
 * @param rgba 色
 */
export function arc(
	renderer: g.Renderer,
	x: number,
	y: number,
	rad: number,
	start: number,
	end: number,
	rgba: Uint8Color
): void {
	x = trunc(x);
	y = trunc(y);
	rad = trunc(rad);

	// TODO: rewrite algorithm; arc endpoints are not always drawn

	// Sanity check radius
	if (rad < 0) {
		throw new Error("invalid arguments: rad");
	}

	// Special case for rad=0 - draw a point
	if (rad === 0) {
		pixel(renderer, x, y, rgba);
	}

	const x1 = x - rad;
	const x2 = x + rad;
	const y1 = y - rad;
	const y2 = y + rad;
	const width = x2 - x1 + 1;
	const height = y2 - y1 + 1;
	const imageData = renderer._getImageData(x1, y1, width, height);
	if (!imageData) return;

	const drawPixel = (px: number, py: number) => {
		const dx = px - x1;
		const dy = py - y1;
		const idx = dy * imageData.width + dx;
		imageData.data.set(rgba, idx * 4);
	};

	// Octant labelling
	//
	//  \ 5 | 6 /
	//   \  |  /
	//  4 \ | / 7
	//     \|/
	//------+------ +x
	//     /|\
	//  3 / | \ 0
	//   /  |  \
	//  / 2 | 1 \
	//
	// Initially reset bitmask to 0x00000000
	// the set whether or not to keep drawing a given octant.
	// For example: 0x00111100 means we're drawing in octants 2-5
	let drawoct = 0;

	// Fixup angles
	start %= 360;
	end %= 360;

	// 0 <= start & end < 360; note that sometimes start > end - if so, arc goes back through 0.
	while (start < 0) {
		start += 360;
	}
	while (end < 0) {
		end += 360;
	}
	start %= 360;
	end %= 360;

	// now, we find which octants we're drawing in.
	const startoct = trunc(start / 45);
	const endoct = trunc(end / 45);
	let oct = startoct - 1; // we increment as first step in loop

	// stopval_start, stopval_end;
	// what values of cx to stop at.
	let stopval_start = 0;
	let stopval_end = 0;
	do {
		oct = (oct + 1) % 8;

		let temp = 0;
		if (oct === startoct) {
			// need to compute stopval_start for this octant.  Look at picture above if this is unclear
			switch (oct) {
				case 0:
				case 3:
					temp = Math.sin((start * Math.PI) / 180);
					break;
				case 1:
				case 6:
					temp = Math.cos((start * Math.PI) / 180);
					break;
				case 2:
				case 5:
					temp = -Math.cos((start * Math.PI) / 180);
					break;
				case 4:
				case 7:
					temp = -Math.sin((start * Math.PI) / 180);
					break;
			}
			temp *= rad;
			stopval_start = trunc(temp);

			// This isn't arbitrary, but requires graph paper to explain well.
			// The basic idea is that we're always changing drawoct after we draw, so we
			// stop immediately after we render the last sensible pixel at x = ((int)temp).

			// and whether to draw in this octant initially
			if (oct % 2) {
				// this is basically like saying drawoct[oct] = true, if drawoct were a bool array
				drawoct |= 1 << oct;
			} else {
				// this is basically like saying drawoct[oct] = false
				drawoct &= 255 - (1 << oct);
			}
		}
		if (oct === endoct) {
			// need to compute stopval_end for this octant
			switch (oct) {
				case 0:
				case 3:
					temp = Math.sin((end * Math.PI) / 180);
					break;
				case 1:
				case 6:
					temp = Math.cos((end * Math.PI) / 180);
					break;
				case 2:
				case 5:
					temp = -Math.cos((end * Math.PI) / 180);
					break;
				case 4:
				case 7:
					temp = -Math.sin((end * Math.PI) / 180);
					break;
			}
			temp *= rad;
			stopval_end = trunc(temp);

			// and whether to draw in this octant initially
			if (startoct === endoct) {
				// note:      we start drawing, stop, then start again in this case
				// otherwise: we only draw in this octant, so initialize it to false, it will get set back to true
				if (start > end) {
					// unfortunately, if we're in the same octant and need to draw over the whole circle,
					// we need to set the rest to true, because the while loop will end at the bottom.
					drawoct = 255;
				} else {
					drawoct &= 255 - (1 << oct);
				}
			} else if (oct % 2) {
				drawoct &= 255 - (1 << oct);
			} else {
				drawoct |= 1 << oct;
			}
		} else if (oct !== startoct) {
			// already verified that it's != endoct
			drawoct |= 1 << oct; // draw this entire segment
		}
	} while (oct !== endoct);

	// so now we have what octants to draw and when to draw them. all that's left is the actual raster code.

	// Draw arc
	let cx = 0;
	let cy = rad;
	let df = 1 - rad;
	let d_e = 3;
	let d_se = -2 * rad + 5;
	do {
		let xpcx = 0;
		const ypcy = y + cy;
		let xmcx = 0;
		const ymcy = y - cy;
		if (cx > 0) {
			xpcx = x + cx;
			xmcx = x - cx;

			// always check if we're drawing a certain octant before adding a pixel to that octant.
			if (drawoct & 4) {
				drawPixel(xmcx, ypcy);
			}
			if (drawoct & 2) {
				drawPixel(xpcx, ypcy);
			}
			if (drawoct & 32) {
				drawPixel(xmcx, ymcy);
			}
			if (drawoct & 64) {
				drawPixel(xpcx, ymcy);
			}
		} else {
			if (drawoct & 96) {
				drawPixel(x, ymcy);
			}
			if (drawoct & 6) {
				drawPixel(x, ypcy);
			}
		}

		const xpcy = x + cy;
		let ypcx = 0;
		const xmcy = x - cy;
		let ymcx = 0;
		if (cx > 0 && cx !== cy) {
			ypcx = y + cx;
			ymcx = y - cx;
			if (drawoct & 8) {
				drawPixel(xmcy, ypcx);
			}
			if (drawoct & 1) {
				drawPixel(xpcy, ypcx);
			}
			if (drawoct & 16) {
				drawPixel(xmcy, ymcx);
			}
			if (drawoct & 128) {
				drawPixel(xpcy, ymcx);
			}
		} else if (cx === 0) {
			if (drawoct & 24) {
				drawPixel(xmcy, y);
			}
			if (drawoct & 129) {
				drawPixel(xpcy, y);
			}
		}

		// Update whether we're drawing an octant
		if (stopval_start === cx) {
			// works like an on-off switch.
			// This is just in case start & end are in the same octant.
			if (drawoct & (1 << startoct)) {
				drawoct &= 255 - (1 << startoct);
			} else {
				drawoct |= 1 << startoct;
			}
		}
		if (stopval_end === cx) {
			if (drawoct & (1 << endoct)) {
				drawoct &= 255 - (1 << endoct);
			} else {
				drawoct |= 1 << endoct;
			}
		}

		// Update pixels
		if (df < 0) {
			df += d_e;
			d_e += 2;
			d_se += 2;
		} else {
			df += d_se;
			d_e += 2;
			d_se += 4;
			cy--;
		}
		cx++;
	} while (cx <= cy);

	renderer._putImageData(imageData, x1, y1);
}

/**
 * 角丸の長方形を描く
 *
 * @param renderer 描画するRenderer
 * @param x1 左端のX座標
 * @param y1 上端のY座標
 * @param x2 右端のX座標
 * @param y2 下端のY座標
 * @param rad 半径
 * @param rgba 色
 */
export function roundedRectangle(
	renderer: g.Renderer,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	rad: number,
	rgba: Uint8Color
): void {
	x1 = trunc(x1);
	x2 = trunc(x2);
	y1 = trunc(y1);
	y2 = trunc(y2);
	rad = trunc(rad);

	// Check radius vor valid range
	if (rad < 0) {
		throw new Error("invalid arguments: rad");
	}

	// Special case - no rounding
	if (rad <= 1) {
		rectangle(renderer, x1, y1, x2, y2, rgba);
		return;
	}

	// Test for special cases of straight lines or single point
	if (x1 === x2) {
		if (y1 === y2) {
			pixel(renderer, x1, y1, rgba);
			return;
		} else {
			vline(renderer, x1, y1, y2, rgba);
			return;
		}
	} else {
		if (y1 === y2) {
			hline(renderer, x1, x2, y1, rgba);
			return;
		}
	}

	// Swap x1, x2 if required
	if (x1 > x2) {
		[x1, x2] = [x2, x1];
	}

	// Swap y1, y2 if required
	if (y1 > y2) {
		[y1, y2] = [y2, y1];
	}

	// Calculate width&height
	const w = x2 - x1 + 1;
	const h = y2 - y1 + 1;

	// Maybe adjust radius
	if (rad * 2 > w) {
		rad = trunc(w / 2);
	}
	if (rad * 2 > h) {
		rad = trunc(h / 2);
	}

	// Draw corners
	const xx1 = x1 + rad;
	const xx2 = x2 - rad;
	const yy1 = y1 + rad;
	const yy2 = y2 - rad;
	arc(renderer, xx1, yy1, rad, 180, 270, rgba);
	arc(renderer, xx2, yy1, rad, 270, 360, rgba);
	arc(renderer, xx1, yy2, rad, 90, 180, rgba);
	arc(renderer, xx2, yy2, rad, 0, 90, rgba);

	// Draw lines
	if (xx1 <= xx2) {
		hline(renderer, xx1, xx2, y1, rgba);
		hline(renderer, xx1, xx2, y2, rgba);
	}
	if (yy1 <= yy2) {
		vline(renderer, x1, yy1, yy2, rgba);
		vline(renderer, x2, yy1, yy2, rgba);
	}
}

/**
 * 角丸のボックス(塗りつぶした長方形)を描画する
 *
 * @param renderer 描画するRenderer
 * @param x1 左端のX座標
 * @param y1 上端のY座標
 * @param x2 右端のX座標
 * @param y2 下端のY座標
 * @param rad 半径
 * @param rgba 色
 */
export function roundedBox(
	renderer: g.Renderer,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	rad: number,
	rgba: Uint8Color
): void {
	x1 = trunc(x1);
	x2 = trunc(x2);
	y1 = trunc(y1);
	y2 = trunc(y2);
	rad = trunc(rad);

	// Check radius vor valid range
	if (rad < 0) {
		throw new Error("invalid arguments: rad");
	}

	// Special case - no rounding
	if (rad <= 1) {
		box(renderer, x1, y1, x2, y2, rgba); // 元コードだとrectangleだけどおそらくboxが正しい
		return;
	}

	// Test for special cases of straight lines or single point
	if (x1 === x2) {
		if (y1 === y2) {
			pixel(renderer, x1, y1, rgba);
			return;
		} else {
			vline(renderer, x1, y1, y2, rgba);
			return;
		}
	} else {
		if (y1 === y2) {
			hline(renderer, x1, x2, y1, rgba);
			return;
		}
	}

	// Swap x1, x2 if required
	if (x1 > x2) {
		[x1, x2] = [x2, x1];
	}

	// Swap y1, y2 if required
	if (y1 > y2) {
		[y1, y2] = [y2, y1];
	}

	// Calculate width&height
	const w = x2 - x1 + 1;
	const h = y2 - y1 + 1;

	// Maybe adjust radius
	if (rad * 2 > w) {
		rad = trunc(w / 2);
	}
	if (rad * 2 > h) {
		rad = trunc(h / 2);
	}

	// Setup filled circle drawing for corners
	const x = x1 + rad;
	const y = y1 + rad;
	const dx = x2 - x1 - rad - rad;
	const dy = y2 - y1 - rad - rad;

	// Draw corners
	let cx = 0;
	let cy = rad;
	let ocx = 0xffff;
	let ocy = 0xffff;
	let df = 1 - rad;
	let d_e = 3;
	let d_se = -2 * rad + 5;
	do {
		const xpcx = x + cx;
		const xmcx = x - cx;
		const xpcy = x + cy;
		const xmcy = x - cy;
		let ypcx = 0;
		let ymcx = 0;
		let ypcy = 0;
		let ymcy = 0;
		if (ocy !== cy) {
			if (cy > 0) {
				ypcy = y + cy;
				ymcy = y - cy;
				hline(renderer, xmcx, xpcx + dx, ypcy + dy, rgba);
				hline(renderer, xmcx, xpcx + dx, ymcy, rgba);
			} else {
				hline(renderer, xmcx, xpcx + dx, y, rgba);
			}
			ocy = cy;
		}
		if (ocx !== cx) {
			if (cx !== cy) {
				if (cx > 0) {
					ypcx = y + cx;
					ymcx = y - cx;
					hline(renderer, xmcy, xpcy + dx, ymcx, rgba);
					hline(renderer, xmcy, xpcy + dx, ypcx + dy, rgba);
				} else {
					hline(renderer, xmcy, xpcy + dx, y, rgba);
				}
			}
			ocx = cx;
		}

		// Update
		if (df < 0) {
			df += d_e;
			d_e += 2;
			d_se += 2;
		} else {
			df += d_se;
			d_e += 2;
			d_se += 4;
			cy--;
		}
		cx++;
	} while (cx <= cy);

	// Inside
	if (dx > 0 && dy > 0) {
		box(renderer, x1, y1 + rad + 1, x2, y2 - rad, rgba);
	}
}

/**
 * ポリゴンを描画
 *
 * @param renderer 描画するRenderer
 * @param vs 頂点の配列
 * @param rgba 色
 */
export function polygon(renderer: g.Renderer, vs: g.CommonOffset[], rgba: Uint8Color): void {
	if (vs.length < 3) {
		throw new Error("invalid parametr: vs");
	}

	for (let i = 0; i < vs.length - 1; i++) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		line(renderer, vs[i].x, vs[i].y, vs[i + 1].x, vs[i + 1].y, rgba);
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	line(renderer, vs[vs.length - 1].x, vs[vs.length - 1].y, vs[0].x, vs[0].y, rgba);
}

/**
 * 塗りつぶしたポリゴンを描画
 *
 * @param renderer 描画するRenderer
 * @param vs 頂点の配列
 * @param rgba 色
 */
export function filledPolygon(renderer: g.Renderer, vs: g.CommonOffset[], rgba: Uint8Color): void {
	/* eslint-disable @typescript-eslint/ban-ts-comment */

	const vsTrunc = vs.map((v) => ({ x: trunc(v.x), y: trunc(v.y) }));

	const n = vsTrunc.length;
	if (n < 3) {
		throw new Error("invalid parametr: vs");
	}

	// @ts-ignore
	let minX = vsTrunc[0].x;
	let maxX = minX;

	// @ts-ignore
	let minY = vsTrunc[0].y;
	let maxY = minY;

	for (let i = 1; i < vsTrunc.length; i++) {
		// @ts-ignore
		minX = Math.min(minX, vsTrunc[i].x);
		// @ts-ignore
		maxX = Math.max(maxX, vsTrunc[i].x);
		// @ts-ignore
		minY = Math.min(minY, vsTrunc[i].y);
		// @ts-ignore
		maxY = Math.max(maxY, vsTrunc[i].y);
	}

	// Draw, scanning y

	for (let y = minY; y <= maxY; y++) {
		const buffer: number[] = [];

		for (let i = 0; i < n; i++) {
			let ind1 = 0;
			let ind2 = 0;
			if (i === 0) {
				ind1 = n - 1;
				ind2 = 0;
			} else {
				ind1 = i - 1;
				ind2 = i;
			}
			let x1 = 0;
			// @ts-ignore
			let y1 = vsTrunc[ind1].y;
			let x2 = 0;
			// @ts-ignore
			let y2 = vsTrunc[ind2].y;
			if (y1 < y2) {
				// @ts-ignore
				x1 = vsTrunc[ind1].x;
				// @ts-ignore
				x2 = vsTrunc[ind2].x;
			} else if (y1 > y2) {
				// @ts-ignore
				y2 = vsTrunc[ind1].y;
				// @ts-ignore
				y1 = vsTrunc[ind2].y;
				// @ts-ignore
				x2 = vsTrunc[ind1].x;
				// @ts-ignore
				x1 = vsTrunc[ind2].x;
			} else {
				continue;
			}
			if ((y >= y1 && y < y2) || (y == maxY && y > y1 && y <= y2)) {
				buffer.push(((y - y1) / (y2 - y1)) * (x2 - x1) + x1);
			}
		}

		buffer.sort((a, b) => a - b);

		for (let i = 0; i < buffer.length; i += 2) {
			// @ts-ignore
			const xa = Math.ceil(buffer[i]);
			// @ts-ignore
			const xb = Math.floor(buffer[i + 1]);
			hline(renderer, xa, xb, y, rgba);
		}
	}
	/* eslint-enable @typescript-eslint/ban-ts-comment */
}

/**
 * 三角形を描画する
 *
 * @param renderer 描画するRenderer
 * @param x1 1つ目の頂点のX座標
 * @param y1 1つ目の頂点のY座標
 * @param x2 2つ目の頂点のX座標
 * @param y2 2つ目の頂点のY座標
 * @param x3 3つ目の頂点のX座標
 * @param y3 3つ目の頂点のY座標
 * @param rgba 色
 */
export function trigon(
	renderer: g.Renderer,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
	rgba: Uint8Color
): void {
	polygon(
		renderer,
		[
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: x3, y: y3 },
		],
		rgba
	);
}

/**
 * 塗りつぶした三角形を描画する
 *
 * @param renderer 描画するRenderer
 * @param x1 1つ目の頂点のX座標
 * @param y1 1つ目の頂点のY座標
 * @param x2 2つ目の頂点のX座標
 * @param y2 2つ目の頂点のY座標
 * @param x3 3つ目の頂点のX座標
 * @param y3 3つ目の頂点のY座標
 * @param rgba 色
 */
export function filledTrigon(
	renderer: g.Renderer,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x3: number,
	y3: number,
	rgba: Uint8Color
): void {
	filledPolygon(
		renderer,
		[
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: x3, y: y3 },
		],
		rgba
	);
}

/**
 * 扇形を描画する
 *
 * @param renderer 描画するRenderer
 * @param x 扇の中心のX座標
 * @param y 扇の中心のY座標
 * @param rad 扇の半径
 * @param start 扇の開始角度の度数。0度の場合は右端。時計回りに増える。
 * @param end 扇の終了角度の度数。0度の場合は右端。時計回りに増える。
 * @param rgba 色
 */
export function pie(
	renderer: g.Renderer,
	x: number,
	y: number,
	rad: number,
	start: number,
	end: number,
	rgba: Uint8Color
): void {
	x = trunc(x);
	y = trunc(y);
	rad = trunc(rad);

	// Sanity check radius
	if (rad < 0) {
		throw new Error("invalid parameter: rad");
	}

	start = start % 360;
	end = end % 360;

	if (rad === 0) {
		pixel(renderer, x, y, rgba);
		return;
	}

	const deltaAngle = 3.0 / rad;
	const start_angle = start * ((2.0 * Math.PI) / 360.0);
	let end_angle = end * ((2.0 * Math.PI) / 360.0);
	if (start > end) {
		end_angle += 2.0 * Math.PI;
	}

	const vs: g.CommonOffset[] = [];

	// Center
	vs.push({ x, y });

	// First vertex
	let angle = start_angle;
	vs.push({ x: x + rad * Math.cos(angle), y: y + rad * Math.sin(angle) });

	if (start_angle > end_angle) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		line(renderer, vs[0].x, vs[0].y, vs[1].x, vs[1].y, rgba);
	} else {
		angle = start_angle;
		while (angle < end_angle) {
			angle += deltaAngle;
			if (angle > end_angle) {
				angle = end_angle;
			}
			vs.push({
				x: x + rad * Math.cos(angle),
				y: y + rad * Math.sin(angle),
			});
		}
		polygon(renderer, vs, rgba);
	}
}

/**
 * 塗りつぶした扇形を描画する
 *
 * @param renderer 描画するRenderer
 * @param x 扇の中心のX座標
 * @param y 扇の中心のY座標
 * @param rad 扇の半径
 * @param start 扇の開始角度の度数。0度の場合は右端。時計回りに増える。
 * @param end 扇の終了角度の度数。0度の場合は右端。時計回りに増える。
 * @param rgba 色
 */
export function filledPie(
	renderer: g.Renderer,
	x: number,
	y: number,
	rad: number,
	start: number,
	end: number,
	rgba: Uint8Color
): void {
	x = trunc(x);
	y = trunc(y);
	rad = trunc(rad);

	// Sanity check radius
	if (rad < 0) {
		throw new Error("invalid parameter: rad");
	}

	start = start % 360;
	end = end % 360;

	if (rad === 0) {
		pixel(renderer, x, y, rgba);
		return;
	}

	const deltaAngle = 3.0 / rad;
	const start_angle = start * ((2.0 * Math.PI) / 360.0);
	let end_angle = end * ((2.0 * Math.PI) / 360.0);
	if (start > end) {
		end_angle += 2.0 * Math.PI;
	}

	const vs: g.CommonOffset[] = [];

	// Center
	vs.push({ x, y });

	// First vertex
	let angle = start_angle;
	vs.push({ x: x + rad * Math.cos(angle), y: y + rad * Math.sin(angle) });

	if (start_angle > end_angle) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		line(renderer, vs[0].x, vs[0].y, vs[1].x, vs[1].y, rgba);
	} else {
		angle = start_angle;
		while (angle < end_angle) {
			angle += deltaAngle;
			if (angle > end_angle) {
				angle = end_angle;
			}
			vs.push({
				x: x + rad * Math.cos(angle),
				y: y + rad * Math.sin(angle),
			});
		}
		filledPolygon(renderer, vs, rgba);
	}
}

/**
 * ベジェ曲線を描画する
 *
 * @param renderer 描画するRenderer
 * @param vs 頂点の配列
 * @param s ステップ数(2以上)
 * @param rgba 色
 */
export function bezier(renderer: g.Renderer, vs: g.CommonOffset[], s: number, rgba: Uint8Color): void {
	const n = vs.length;
	if (n < 3) {
		throw new Error("invalid parameter: vs");
	}
	if (s < 2) {
		throw new Error("invalid parameter: s");
	}

	const evaluateBezier = (data: number[], t: number): number => {
		if (t < 0) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return data[0];
		}
		if (t >= data.length) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return data[data.length - 1];
		}
		const mu = t / data.length;
		const n = data.length - 1;
		let result = 0.0;
		let muk = 1;
		let munk = Math.pow(1 - mu, n);
		for (let k = 0; k <= n; k++) {
			let nn = n;
			let kn = k;
			let nkn = n - k;
			let blend = muk * munk;
			muk *= mu;
			munk /= 1 - mu;
			while (nn >= 1) {
				blend *= nn;
				nn--;
				if (kn > 1) {
					blend /= kn;
					kn--;
				}
				if (nkn > 1) {
					blend /= nkn;
					nkn--;
				}
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			result += data[k] * blend;
		}
		return result;
	};

	const stepsize = 1.0 / s;
	const xs: number[] = [];
	const ys: number[] = [];

	for (const v of vs) {
		xs.push(v.x);
		ys.push(v.y);
	}

	let t = 0;
	let x1 = Math.round(evaluateBezier(xs, t));
	let y1 = Math.round(evaluateBezier(ys, t));
	let x2 = 0;
	let y2 = 0;
	for (let i = 0; i <= n * s; i++) {
		t += stepsize;
		x2 = evaluateBezier(xs, t);
		y2 = evaluateBezier(ys, t);
		line(renderer, x1, y1, x2, y2, rgba);
		x1 = x2;
		y1 = y2;
	}
}
