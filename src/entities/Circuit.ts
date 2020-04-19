import { Vector } from "~/core/Vector";
import { Entity } from "./Entity";
import { Game } from "~";
import { Level } from "~/core/Level";
import { Counter } from "./Counter";

class Circuit extends Entity {
	position: Vector;
	gid: number;
	level: Level;
	powered: boolean;
	wasPowered: boolean;

	constructor(level: Level, position: Vector, gid: number) {
		super();
		this.position = position;
		this.gid = gid;
		this.level = level;
		this.powered = false;
		this.wasPowered = false;
	}

	static isCircuit(entity: Entity): entity is Circuit {
		return entity instanceof Circuit;
	}

	update(game: Game) {
		if (this.wasPowered !== this.powered) {
			const circuits = this.level.entities
				.filter(
					(entity) => Circuit.isCircuit(entity) || Counter.isCounter(entity)
				)
				.filter((circuit) => circuit !== this) as Array<Counter | Circuit>;

			const neighbors = circuits.filter(
				(circuit) =>
					(circuit.position.x === this.position.x &&
						circuit.position.y === this.position.y - Game.CELL) ||
					(circuit.position.x === this.position.x &&
						circuit.position.y === this.position.y + Game.CELL) ||
					(circuit.position.x === this.position.x + Game.CELL &&
						circuit.position.y === this.position.y) ||
					(circuit.position.x === this.position.x - Game.CELL &&
						circuit.position.y === this.position.y)
			);

			neighbors.forEach((neighbor) => (neighbor.powered = this.powered));
			this.wasPowered = this.powered;
		}
	}

	render(game: Game) {
		const renderer = game.renderer;

		renderer.drawTile(this.gid, this.position);
		const id = renderer.unflag(this.gid);

		if (this.powered) {
			const offset = Math.floor(game.clock.frame / 6) % 4;

			renderer.drawTile(id + (this.gid - id) + offset * 10 + 10, this.position);
		}
	}
}

export { Circuit };
