var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		const cx = 100;
		const cy = 100;

		for (let r = 0; r < 100; r += 10) {
			lib.primitives.ellipse(surface.renderer(), cx, cy, r, 30, rgba);
			lib.primitives.ellipse(surface.renderer(), cx, cy, 30, r, rgba);
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
