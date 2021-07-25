var lib = require("@lambdataro/akashic-primitives");

function main() {
	var scene = new g.Scene({ game: g.game });
	scene.onLoad.addOnce(function () {
		for (let y = 0; y <= 10; y++) {
			for (let x = 0; x <= 10; x++) {
				const cssColor = lib.color.toCssColor(lib.color.hsl(0.0, x / 10, y / 10));
				new g.FilledRect({
					scene,
					parent: scene,
					x: x * 16 + 10,
					y: y * 16 + 10,
					width: 10,
					height: 10,
					cssColor,
				});
			}
		}
	});
	g.game.pushScene(scene);
}

module.exports = main;
