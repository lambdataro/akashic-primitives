# akashic-primitives

`akashic-primitives` は直線や楕円といったグラフィックプリミティブを akashic-engine で利用するためのライブラリです。

このライブラリは A. Schiffler 氏による
[SDL_gfx/SDL2_gfx ライブラリ](https://www.ferzkopp.net/wordpress/2016/01/02/sdl_gfx-sdl2_gfx/)
のコードやアルゴリズムを元に作られています。
SDL_gfx ライブラリと SDL2_gfx ライブラリはどちらも zlib license で公開されています。

SDL2_gfx:

> (C) A. Schiffler, aschiffler [at] ferzkopp.net 2012-2018, licensed under the zlib license

SDL_gfx:

> (C) A. Schiffler, aschiffler [at] ferzkopp.net 1999-2018, licensed under the zlib license

`akashic-primitives` は `g.Renderer` の `_getImageData` と `_putImageData` を利用して描画を行います。
Canvas レンダラでこれらのメソッドが利用できる一方、WebGL レンダラでは利用できないので、
`game.json` の `renderers` に `["canvas"]` の指定が必要となります。

```json
{
    ...
    "renderers": ["canvas"]
}
```

## プリミティブ一覧

### 点

- `pixel()`: ピクセルを描く

### 線

- `hline()`: 水平線を描く
- `vline()`: 垂直線を描く
- `line()`: 線を描く
- `arc()`: 円弧を描く
- `bezier()`: ベジェ曲線を描く

### 図形

- `rectangle()`: 長方形を描く
- `ellipse()`: 楕円を描く
- `circle()`: 円を描く
- `roundedRectangle()`: 角丸長方形を描く
- `polygon()`: ポリゴンを描く
- `trigon()`: 三角形を描く
- `pie()`: 扇形を描く

### 塗りつぶした図形

- `box()`: 塗りつぶした長方形を描く
- `filledEllipse()`: 塗りつぶした楕円を描く
- `filledCircle()`: 塗りつぶした円を描く
- `roundedBox()`: 塗りつぶした角丸長方形を描く
- `filledPolygon()`: 塗りつぶしたポリゴンを描く
- `filledTrigon()`: 塗りつぶした三角形を描く
- `filledPie()`: 塗りつぶした扇形を描く

## 使い方

線を引くには以下のようにします。

```js
var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);
		lib.primitives.line(surface.renderer(), 50, 50, 150, 100, rgba);
		new g.Sprite({
			scene: scene,
			parent: scene,
			src: surface,
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
```

他の形状は `test/` 以下を参照してください。

## ビルド方法

```sh
$ npm install
$ npm run build
```

## テスト方法

```sh
$ npm run prepare
$ npm test
```
