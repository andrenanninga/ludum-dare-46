import { Vector } from "~/core/Vector";
import { Entity } from "./Entity";
import { Game } from "~";
import { Input } from "~/core/Input";

enum State {
	Counting,
	OhHi,
	Go,
	Blink,
	PlzKeepMeAlive,
	Loading,
	Happy,
}

class Counter extends Entity {
	position: Vector;
	count: number;
	state: State;
	frame: number;
	powered: boolean;
	wasPowered: boolean;

	constructor(position: Vector, count: number = 0) {
		super();

		this.position = position;
		this.count = count;
		this.state = State.Counting;
		this.powered = false;
		this.wasPowered = false;
		this.frame = 0;
	}

	static isCounter(entity: Entity): entity is Counter {
		return entity instanceof Counter;
	}

	update(game: Game) {
		this.frame += 1;

		if (this.powered && !this.wasPowered) {
			this.state = State.Happy;
			this.wasPowered = this.powered;
			return;
		} else if (!this.powered && this.wasPowered) {
			this.state = State.Counting;
			this.wasPowered = this.powered;
			this.frame = 0;
		}

		if (
			game.input.released(
				[Input.DOWN, Input.UP, Input.RIGHT, Input.LEFT].flat()
			)
		) {
			this.count = Math.min(this.count + 1, 99);
		}
		if (this.state === State.Counting && this.frame >= 350 && this.count > 0) {
			this.frame = 0;
			this.state = [State.Blink, State.OhHi, State.Go][
				Math.floor(Math.random() * 3)
			];
		}
	}

	render(game: Game) {
		const renderer = game.renderer;

		renderer.drawTile(40, this.position);

		if (this.state === State.Counting) {
			const ones = this.count % 10;
			const tens = Math.floor(this.count / 10);

			if (this.count === 99) {
				if (Math.floor(this.frame / 20) % 2 === 0) {
					return;
				}
			}

			renderer.drawTile(91 + ones, this.position);
			renderer.drawTile(101 + tens, this.position);
		} else if (this.state === State.Loading) {
			const y = Math.floor(this.frame / 10) % 4;
			renderer.drawTile(163 + y * 10, this.position);
		} else if (this.state === State.Happy) {
			if (Math.floor(this.frame / 40) % 2 === 0) {
				const ones = this.count % 10;
				const tens = Math.floor(this.count / 10);

				renderer.drawTile(91 + ones, this.position);
				renderer.drawTile(101 + tens, this.position);
			} else {
				renderer.drawTile(164, this.position);
			}
		} else if (this.state === State.PlzKeepMeAlive) {
			const offset = Math.floor(this.frame / 30) % 18;

			renderer.ctx.drawImage(
				game.assets.images["four-color"],
				1 + offset * 7,
				176,
				14,
				14,
				this.position.x + 1,
				this.position.y,
				14,
				14
			);

			if (this.frame >= 30 * 18 - 1) {
				this.state = State.Counting;
				this.frame = 0;
			}
		} else if (this.state === State.OhHi) {
			const offset = Math.floor(this.frame / 40) % 3;

			renderer.drawTile(131 + offset * 10, this.position);

			if (this.frame >= 40 * 3 - 1) {
				this.state = State.Counting;
				this.frame = 0;
			}
		} else if (this.state === State.Go) {
			const offset = Math.floor(this.frame / 40) % 3;
			renderer.drawTile(161 + offset * 10, this.position);

			if (this.frame >= 40 * 3 - 1) {
				this.state = State.Counting;
				this.frame = 0;
			}
		} else if (this.state === State.Blink) {
			const offset = Math.floor(this.frame / 40) % 5;

			renderer.drawTile(132 + offset * 10, this.position);

			if (this.frame >= 40 * 5 - 1) {
				this.state = State.Counting;
				this.frame = 0;
			}
		}
	}
}

export { Counter };
