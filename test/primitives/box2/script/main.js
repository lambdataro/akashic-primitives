var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		const pairs = [
			[15, 10],
			[24, 20],
			[33, 30],
			[42, 40],
			[51, 50], // 水平線 (反転)
			[60, 60], // 点
			[70, 71], // 水平線
			[80, 82],
			[90, 93],
			[100, 104],
			[110, 115],
		];

		for (const [x1, x2] of pairs) {
			for (const [y1, y2] of pairs) {
				lib.primitives.box(surface.renderer(), x1, y1, x2, y2, rgba);
			}
		}

		new g.Sprite({
			scene: scene,
			parent: scene,
			src: surface,
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
