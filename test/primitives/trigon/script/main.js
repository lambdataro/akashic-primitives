var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		var surface = g.game.resourceFactory.createSurface(200, 200);
		var rgba = new Uint8ClampedArray([0, 0, 255, 255]);

		const cx = 100;
		const cy = 100;
		const len = 90;

		for (let r = 0; r < 360; r += 30) {
			const x2 = cx + Math.sin((r * Math.PI) / 180) * len;
			const y2 = cy + Math.cos((r * Math.PI) / 180) * len;
			const x3 = cx + Math.sin(((r + 20) * Math.PI) / 180) * len;
			const y3 = cy + Math.cos(((r + 20) * Math.PI) / 180) * len;
			lib.primitives.trigon(surface.renderer(), cx, cy, x2, y2, x3, y3, rgba);
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
