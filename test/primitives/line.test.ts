import * as path from "path";
import * as fs from "fs";
import Pixelmatch from "pixelmatch";
import { GameContext } from "@akashic/headless-akashic";
import { PNG } from "pngjs";

describe("line", () => {
	test("線を1本描画できる", async () => {
		const context = new GameContext({
			gameJsonPath: path.join(__dirname, "line1", "game.json"),
		});
		const client = await context.getGameClient({ renderingMode: "canvas" });
		const expectedImage = fs.readFileSync(path.join(__dirname, "..", "images", "line1.png"));

		const b1 = PNG.sync.read(client.getPrimarySurfaceCanvas().toBuffer()).data;
		const b2 = PNG.sync.read(expectedImage).data;
		expect(Pixelmatch(b1, b2, null, 1280, 720, { threshold: 0.01 })).toBe(0);

		await context.destroy();
	});
	test("線をいろいろな角度で描画できる", async () => {
		const context = new GameContext({
			gameJsonPath: path.join(__dirname, "line2", "game.json"),
		});
		const client = await context.getGameClient({ renderingMode: "canvas" });
		const expectedImage = fs.readFileSync(path.join(__dirname, "..", "images", "line2.png"));

		const b1 = PNG.sync.read(client.getPrimarySurfaceCanvas().toBuffer()).data;
		const b2 = PNG.sync.read(expectedImage).data;
		expect(Pixelmatch(b1, b2, null, 1280, 720, { threshold: 0.01 })).toBe(0);

		await context.destroy();
	});
	test("点・水平線・垂直線になる場合に描画できる", async () => {
		const context = new GameContext({
			gameJsonPath: path.join(__dirname, "line3", "game.json"),
		});
		const client = await context.getGameClient({ renderingMode: "canvas" });
		const expectedImage = fs.readFileSync(path.join(__dirname, "..", "images", "point_hline_vline.png"));

		const b1 = PNG.sync.read(client.getPrimarySurfaceCanvas().toBuffer()).data;
		const b2 = PNG.sync.read(expectedImage).data;
		expect(Pixelmatch(b1, b2, null, 1280, 720, { threshold: 0.01 })).toBe(0);

		await context.destroy();
	});
	test("座標を入れ替えできる", async () => {
		const context = new GameContext({
			gameJsonPath: path.join(__dirname, "line4", "game.json"),
		});
		const client = await context.getGameClient({ renderingMode: "canvas" });
		const expectedImage = fs.readFileSync(path.join(__dirname, "..", "images", "line1.png"));

		const b1 = PNG.sync.read(client.getPrimarySurfaceCanvas().toBuffer()).data;
		const b2 = PNG.sync.read(expectedImage).data;
		expect(Pixelmatch(b1, b2, null, 1280, 720, { threshold: 0.01 })).toBe(0);

		await context.destroy();
	});
});
