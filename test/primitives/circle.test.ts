import * as path from "path";
import * as fs from "fs";
import Pixelmatch from "pixelmatch";
import { GameContext } from "@akashic/headless-akashic";
import { PNG } from "pngjs";

describe("pixel", () => {
	test("円を描画できる", async () => {
		const context = new GameContext({
			gameJsonPath: path.join(__dirname, "circle", "game.json"),
		});
		const client = await context.getGameClient({ renderingMode: "canvas" });
		const expectedImage = fs.readFileSync(path.join(__dirname, "..", "images", "circle.png"));

		const b1 = PNG.sync.read(client.getPrimarySurfaceCanvas().toBuffer()).data;
		const b2 = PNG.sync.read(expectedImage).data;
		expect(Pixelmatch(b1, b2, null, 1280, 720, { threshold: 0.01 })).toBe(0);

		await context.destroy();
	});
});
