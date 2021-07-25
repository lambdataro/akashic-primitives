var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		const cx = 100;
		const cy = 100;
		const len = 90;

		for (let r = 0; r < 360; r += 45) {
			lib.primitives.filledPie(surface.renderer(), cx, cy, len, r, r + 30, rgba);
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
