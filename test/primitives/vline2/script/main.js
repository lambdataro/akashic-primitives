var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(100, 100);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);
		lib.primitives.vline(surface.renderer(), 10, 30, 10, rgba);
		new g.Sprite({
			scene: scene,
			parent: scene,
			src: surface,
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
