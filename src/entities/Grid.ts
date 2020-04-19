import { Game } from "~";
import { Vector } from "~/core/Vector";
import { Entity } from "./Entity";

class Grid extends Entity {
	constructor() {
		super(new Vector());
	}

	render(game: Game) {
		const renderer = game.renderer;

		renderer.ctx.beginPath();
		renderer.ctx.lineWidth = 0.4;
		renderer.ctx.strokeStyle = "#ff00ff";
		for (let x = 0; x < game.width; x += Game.CELL) {
			for (let y = 0; y < game.height; y += Game.CELL) {
				renderer.ctx.fillStyle = x % 32 === y % 32 ? "#203c56" : "#0d2b45";
				renderer.ctx.fillRect(x, y, Game.CELL, Game.CELL);
			}
		}
	}
}

export { Grid };
