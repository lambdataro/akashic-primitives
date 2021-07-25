var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		let angle = 0;
		for (let rad = 0; rad < 50; rad += 3) {
			lib.primitives.arc(surface.renderer(), 50, 50, rad, 0, angle, rgba);
			lib.primitives.arc(surface.renderer(), 150, 50, rad, angle, 0, rgba);
			lib.primitives.arc(surface.renderer(), 50, 150, rad, angle, angle + 90, rgba);
			lib.primitives.arc(surface.renderer(), 150, 150, rad, angle + 90, angle, rgba);
			angle += 20;
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
