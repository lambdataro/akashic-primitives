var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		const pairs = [
			[20, 0],
			[40, 1],
			[60, 2],
			[80, 3],
			[100, 4],
			[120, 5],
			[140, 6],
			[160, 7],
			[180, 8],
		];

		for (const [cx, rx] of pairs) {
			for (const [cy, ry] of pairs) {
				lib.primitives.filledEllipse(surface.renderer(), cx, cy, rx, ry, rgba);
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
