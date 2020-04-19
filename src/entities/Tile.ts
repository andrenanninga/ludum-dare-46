import { Vector } from "~/core/Vector";
import { Entity } from "./Entity";
import { Game, renderer } from "~";

class Tile extends Entity {
	static SOLID = [
		40,
		119,
		124,
		125,
		126,
		127,
		129,
		130,
		136,
		137,
		138,
		139,
		140,
		146,
		147,
		156,
		160,
		166,
		170,
		176,
		184,
		185,
		186,
		187,
		194,
		195,
		196,
		197,
		205,
		206,
		228,
		238,
		249,
	];

	position: Vector;
	gid: number;
	solid: boolean;

	constructor(position: Vector, gid: number) {
		super();
		this.position = position;
		this.gid = gid;
		this.solid = Tile.SOLID.includes(renderer.unflag(gid));
	}

	render(game: Game) {
		const renderer = game.renderer;

		renderer.drawTile(this.gid, this.position);

		if (this.gid === 184 && Math.floor(game.clock.frame / 20) % 2) {
			renderer.drawTile(174, this.position);
		}
		if (this.gid === 194 && Math.floor(game.clock.frame / 20) % 2) {
			renderer.drawTile(191, this.position);
		}
		if (this.gid === 195 && Math.floor(game.clock.frame / 20) % 2) {
			renderer.drawTile(192, this.position);
		}

		// if (this.solid) {
		// 	renderer.ctx.strokeStyle = "#00ff00";
		// 	renderer.ctx.strokeRect(this.position.x, this.position.y, 16, 16);
		// }
	}
}

export { Tile };
