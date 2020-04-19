import { Game } from "~";
import { Entity } from "./Entity";
import { Vector } from "~/core/Vector";
import { Orientation } from "~/@types/Orientation";
import { Level } from "~/core/Level";
import { Circuit } from "./Circuit";
import { Counter } from "./Counter";

class Socket extends Entity {
	public orientation: Orientation;
	public position: Vector;
	public powered: boolean;
	level: Level;

	constructor(position: Vector, orientation: Orientation, level: Level) {
		super();

		this.position = position;
		this.orientation = orientation;
		this.powered = false;
		this.level = level;
	}

	update() {
		const circuits = this.level.entities.filter(
			(entity) => Circuit.isCircuit(entity) || Counter.isCounter(entity)
		) as Array<Counter | Circuit>;

		const neighbors = circuits.filter(
			(circuit) =>
				(this.orientation === Orientation.North &&
					circuit.position.x === this.position.x &&
					circuit.position.y === this.position.y - Game.CELL * 2) ||
				(this.orientation === Orientation.South &&
					circuit.position.x === this.position.x &&
					circuit.position.y === this.position.y + Game.CELL) ||
				(this.orientation === Orientation.East &&
					circuit.position.x === this.position.x + Game.CELL * 2 &&
					circuit.position.y === this.position.y) ||
				(this.orientation === Orientation.West &&
					circuit.position.x === this.position.x - Game.CELL &&
					circuit.position.y === this.position.y)
		);

		neighbors.forEach((neighbor) => (neighbor.powered = this.powered));
	}
}

export { Socket };
