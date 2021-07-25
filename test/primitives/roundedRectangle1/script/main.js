var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		let width = 50;
		let height = 10;
		const rad = 30;

		for (let i = 0; i < 12; i++) {
			const x = 100;
			const y = 100;
			lib.primitives.roundedRectangle(
				surface.renderer(),
				x - width / 2,
				y - height / 2,
				x + width / 2,
				y + height / 2,
				rad,
				rgba
			);
			width += 10;
			height += 10;
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
