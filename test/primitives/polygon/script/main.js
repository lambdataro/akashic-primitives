var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		const vs = [
			{ x: 20, y: 20 },
			{ x: 40, y: 180 },
			{ x: 180, y: 160 },
		];

		lib.primitives.polygon(surface.renderer(), vs, rgba);

		vs.push({ x: 160, y: 100 });
		lib.primitives.polygon(surface.renderer(), vs, rgba);

		vs.push({ x: 100, y: 40 });
		lib.primitives.polygon(surface.renderer(), vs, rgba);

		new g.Sprite({
			scene: scene,
			parent: scene,
			src: surface,
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
