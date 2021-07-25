var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		lib.primitives.filledPolygon(
			surface.renderer(),
			[
				{ x: 20, y: 20 },
				{ x: 40, y: 30 },
				{ x: 60, y: 100 },
				{ x: 80, y: 50 },
				{ x: 50, y: 20 },
			],
			rgba
		);

		lib.primitives.filledPolygon(
			surface.renderer(),
			[
				{ x: 100, y: 50 },
				{ x: 150, y: 50 },
				{ x: 100, y: 100 },
				{ x: 150, y: 100 },
			],
			rgba
		);

		new g.Sprite({
			scene: scene,
			parent: scene,
			src: surface,
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
