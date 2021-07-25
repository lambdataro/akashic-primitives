var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		let rad = 1;
		for (let y = 20; y < 160; y += 40) {
			for (let x = 20; x < 200; x += 60) {
				lib.primitives.roundedBox(surface.renderer(), x, y, x + 56, y + 36, rad, rgba);
				rad += 2;
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
