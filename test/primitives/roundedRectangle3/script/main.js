var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		// 点
		lib.primitives.roundedRectangle(surface.renderer(), 50, 50, 50, 50, 30, rgba);

		// 水平線
		lib.primitives.roundedRectangle(surface.renderer(), 100, 50, 150, 50, 30, rgba);

		// 垂直線
		lib.primitives.roundedRectangle(surface.renderer(), 50, 100, 50, 150, 30, rgba);

		new g.Sprite({
			scene: scene,
			parent: scene,
			src: surface,
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
