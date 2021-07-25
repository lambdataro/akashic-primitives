var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		lib.primitives.bezier(
			surface.renderer(),
			[
				{ x: 50, y: 50 },
				{ x: 80, y: 150 },
				{ x: 120, y: 150 },
				{ x: 150, y: 50 },
			],
			4,
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
