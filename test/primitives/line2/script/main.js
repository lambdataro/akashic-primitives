var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		var cx = 100;
		var cy = 100;
		var len = 50;
		var r, x, y;
		for (r = 0; r < 360; r += 5) {
			x = cx + Math.sin((r * Math.PI) / 180) * len;
			y = cy + Math.cos((r * Math.PI) / 180) * len;
			lib.primitives.line(surface.renderer(), cx, cy, x, y, rgba);
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
