import { Game } from "~";
import { Entity } from "./Entity";
import { Vector } from "~/core/Vector";
import { Input } from "~/core/Input";
import { Orientation } from "~/@types/Orientation";
import { Level } from "~/core/Level";

enum State {
	Idle = "Idle",
	Wait = "Wait",
	FlipEastToNorth = "FlipEastToNorth",
	FlipEastToSouth = "FlipEastToSouth",
	FlipNorthToEast = "FlipNorthToEast",
	FlipNorthToSouth = "FlipNorthToSouth",
	FlipNorthToWest = "FlipNorthToWest",
	FlipSouthToEast = "FlipSouthToEast",
	FlipSouthToNorth = "FlipSouthToNorth",
	FlipSouthToWest = "FlipSouthToWest",
	FlipWestToNorth = "FlipWestToNorth",
	FlipWestToSouth = "FlipWestToSouth",
	RollEastNorth = "RollEastNorth",
	RollWestNorth = "RollWestNorth",
	RollEastSouth = "RollEastSouth",
	RollWestSouth = "RollWestSouth",
}

class Battery extends Entity {
	public orientation: Orientation;
	public position: Vector;
	public state: State;
	private frames: number;
	public connected: boolean;
	level: Level;

	static ANIMATION_FRAMES = 4;

	constructor(position: Vector, orientation: Orientation, level: Level) {
		super();

		this.position = position;
		this.orientation = orientation;
		this.state = State.Idle;
		this.frames = 0;
		this.connected = false;
		this.level = level;
	}

	static isBattery(entity: Entity): entity is Battery {
		return entity instanceof Battery;
	}

	update(game: Game) {
		const input = game.input;
		this.frames += 1;

		const other = this.level.entities
			.filter(Battery.isBattery)
			.filter((battery) => battery !== this)[0];
		const shouldWait = other
			? other.state === State.RollEastNorth ||
			  other.state === State.RollEastSouth ||
			  other.state === State.RollWestNorth ||
			  other.state === State.RollWestSouth
			: false;

		if (this.state !== State.Idle) {
			return;
		}

		let nextOrientation = this.orientation;
		let nextPosition = this.position.clone();
		let nextState = State.Idle;

		if (input.pressed(Input.UP)) {
			if (this.orientation === Orientation.East) {
				nextState = State.RollEastNorth;
				nextPosition.y -= 1 * Game.CELL;
			} else if (this.orientation === Orientation.West) {
				nextState = State.RollWestNorth;
				nextPosition.y -= 1 * Game.CELL;
			}
		} else if (input.pressed(Input.DOWN)) {
			if (this.orientation === Orientation.East) {
				nextState = State.RollEastSouth;
				nextPosition.y += 1 * Game.CELL;
			} else if (this.orientation === Orientation.West) {
				nextState = State.RollWestSouth;
				nextPosition.y += 1 * Game.CELL;
			}
		} else if (input.pressed(Input.RIGHT) && !shouldWait) {
			if (this.orientation === Orientation.North) {
				nextState = State.FlipNorthToEast;
				nextOrientation = Orientation.East;
			} else if (this.orientation === Orientation.East) {
				nextState = State.FlipEastToSouth;
				nextOrientation = Orientation.South;
				nextPosition.x += 1 * Game.CELL;
			} else if (this.orientation === Orientation.South) {
				nextState = State.FlipSouthToWest;
				nextOrientation = Orientation.West;
			} else if (this.orientation === Orientation.West) {
				nextState = State.FlipWestToNorth;
				nextOrientation = Orientation.North;
				nextPosition.x += 1 * Game.CELL;
			}
		} else if (input.pressed(Input.LEFT) && !shouldWait) {
			if (this.orientation === Orientation.North) {
				nextState = State.FlipNorthToWest;
				nextOrientation = Orientation.West;
				nextPosition.x -= 1 * Game.CELL;
			} else if (this.orientation === Orientation.East) {
				nextState = State.FlipEastToNorth;
				nextOrientation = Orientation.North;
			} else if (this.orientation === Orientation.South) {
				nextState = State.FlipSouthToEast;
				nextOrientation = Orientation.East;
				nextPosition.x -= 1 * Game.CELL;
			} else if (this.orientation === Orientation.West) {
				nextState = State.FlipWestToSouth;
				nextOrientation = Orientation.South;
			}
		}

		let allowed = true;
		if (this.level.isSolid(nextPosition.cell())) {
			allowed = false;
		}
		if (
			nextOrientation === Orientation.East &&
			this.level.isSolid(nextPosition.cell().add({ x: 1, y: 0 }))
		) {
			allowed = false;
		}
		if (
			nextOrientation === Orientation.West &&
			this.level.isSolid(nextPosition.cell().add({ x: 1, y: 0 }))
		) {
			allowed = false;
		}
		if (
			(this.orientation === Orientation.North ||
				this.orientation === Orientation.South) &&
			this.level.isSolid(nextPosition.cell().add({ x: 1, y: 0 }))
		) {
			allowed = false;
		}

		if (allowed && nextState !== this.state) {
			// this.level.markSolid(this.position.cell(), false);
			// this.level.markSolid(nextPosition.cell(), true);

			this.orientation = nextOrientation;
			this.position = nextPosition;
			this.state = nextState;
			this.frames = 0;
		}
	}

	render(game: Game) {
		// game.renderer.ctx.strokeStyle = "#ff00ff";
		// game.renderer.ctx.strokeRect(
		// 	this.position.x,
		// 	this.position.y,
		// 	Game.CELL,
		// 	Game.CELL
		// );

		switch (this.state) {
			case State.Idle:
				return this.renderIdle(game);
			case State.FlipEastToNorth:
				return this.renderFlipEastToNorth(game);
			case State.FlipEastToSouth:
				return this.renderFlipEastToSouth(game);
			case State.FlipNorthToEast:
				return this.renderFlipNorthToEast(game);
			case State.FlipNorthToWest:
				return this.renderFlipNorthToWest(game);
			case State.FlipSouthToEast:
				return this.renderFlipSouthToEast(game);
			case State.FlipSouthToWest:
				return this.renderFlipSouthToWest(game);
			case State.FlipWestToNorth:
				return this.renderFlipWestToNorth(game);
			case State.FlipWestToSouth:
				return this.renderFlipWestToSouth(game);
			case State.RollEastNorth:
				return this.renderRollEastNorth(game);
			case State.RollWestNorth:
				return this.renderRollWestNorth(game);
			case State.RollEastSouth:
				return this.renderRollEastSouth(game);
			case State.RollWestSouth:
				return this.renderRollWestSouth(game);

			default: {
				this.state = State.Idle;
				this.renderIdle(game);
			}
		}
	}

	renderIdle(game: Game) {
		const renderer = game.renderer;

		const offset = Math.floor(this.frames / 8) % 5;

		if (this.orientation === Orientation.North) {
			renderer.drawTile(41, this.position);
			renderer.drawTile(31, this.position.clone().add({ x: 0, y: -Game.CELL }));

			if (this.connected) {
				renderer.drawTile(27 + offset * 10, this.position, { x: 1, y: 1 }, -90);
				renderer.drawTile(
					28 + offset * 10,
					this.position.clone().add({ x: 0, y: -Game.CELL }),
					{ x: 1, y: 1 },
					-90
				);
			}
		}

		if (this.orientation === Orientation.East) {
			renderer.drawTile(43, this.position);
			renderer.drawTile(44, this.position.clone().add({ x: Game.CELL, y: 0 }));

			if (this.connected) {
				renderer.drawTile(27 + offset * 10, this.position);
				renderer.drawTile(
					28 + offset * 10,
					this.position.clone().add({ x: Game.CELL, y: 0 })
				);
			}
		}

		if (this.orientation === Orientation.South) {
			renderer.drawTile(42, this.position);
			renderer.drawTile(32, this.position.clone().add({ x: 0, y: -Game.CELL }));

			if (this.connected) {
				renderer.drawTile(
					28 + offset * 10,
					this.position,
					{ x: 1, y: -1 },
					-90
				);
				renderer.drawTile(
					27 + offset * 10,
					this.position.clone().add({ x: 0, y: -Game.CELL }),
					{ x: 1, y: -1 },
					-90
				);
			}
		}

		if (this.orientation === Orientation.West) {
			renderer.drawTile(33, this.position);
			renderer.drawTile(34, this.position.clone().add({ x: Game.CELL, y: 0 }));

			if (this.connected) {
				renderer.drawTile(28 + offset * 10, this.position, { x: -1, y: 1 });
				renderer.drawTile(
					27 + offset * 10,
					this.position.clone().add({ x: Game.CELL, y: 0 }),
					{ x: -1, y: 1 }
				);
			}
		}
	}

	renderFlipEastToNorth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(3, { x: 0, y: -Game.CELL });
		renderer.drawTile(4, { x: Game.CELL, y: -Game.CELL });
		renderer.drawTile(13, { x: 0, y: 0 });
		renderer.drawTile(14, { x: Game.CELL, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipEastToSouth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(9, { x: -Game.CELL, y: -Game.CELL });
		renderer.drawTile(10, { x: 0, y: -Game.CELL });
		renderer.drawTile(19, { x: -Game.CELL, y: 0 });
		renderer.drawTile(20, { x: 0, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipNorthToEast(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(3, { x: 0, y: -Game.CELL });
		renderer.drawTile(4, { x: Game.CELL, y: -Game.CELL });
		renderer.drawTile(13, { x: 0, y: 0 });
		renderer.drawTile(14, { x: Game.CELL, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipNorthToWest(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(5, { x: 0, y: -Game.CELL });
		renderer.drawTile(6, { x: Game.CELL, y: -Game.CELL });
		renderer.drawTile(15, { x: 0, y: 0 });
		renderer.drawTile(16, { x: Game.CELL, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipSouthToEast(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(9, { x: 0, y: -Game.CELL });
		renderer.drawTile(10, { x: Game.CELL, y: -Game.CELL });
		renderer.drawTile(19, { x: 0, y: 0 });
		renderer.drawTile(20, { x: Game.CELL, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipSouthToWest(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(7, { x: 0, y: -Game.CELL });
		renderer.drawTile(8, { x: Game.CELL, y: -Game.CELL });
		renderer.drawTile(17, { x: 0, y: 0 });
		renderer.drawTile(18, { x: Game.CELL, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipWestToNorth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(5, { x: -Game.CELL, y: -Game.CELL });
		renderer.drawTile(6, { x: 0, y: -Game.CELL });
		renderer.drawTile(15, { x: -Game.CELL, y: 0 });
		renderer.drawTile(16, { x: 0, y: 0 });
		renderer.ctx.restore();
	}

	renderFlipWestToSouth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES) {
			this.state = State.Idle;
		}

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		renderer.drawTile(7, { x: 0, y: -Game.CELL });
		renderer.drawTile(8, { x: Game.CELL, y: -Game.CELL });
		renderer.drawTile(17, { x: 0, y: 0 });
		renderer.drawTile(18, { x: Game.CELL, y: 0 });
		renderer.ctx.restore();
	}

	renderRollEastNorth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES * 3) {
			this.state = State.Idle;
			game.input.keys[Input.UP].pressed = true;
		}

		const frame = Math.floor(this.frames / Battery.ANIMATION_FRAMES);

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		if (frame === 0) {
			renderer.drawTile(83, { x: 0, y: Game.CELL });
			renderer.drawTile(84, { x: Game.CELL, y: Game.CELL });
			renderer.drawTile(73, { x: 0, y: 0 });
			renderer.drawTile(74, { x: Game.CELL, y: 0 });
		} else if (frame === 1) {
			renderer.drawTile(63, { x: 0, y: Game.CELL });
			renderer.drawTile(64, { x: Game.CELL, y: Game.CELL });
			renderer.drawTile(53, { x: 0, y: 0 });
			renderer.drawTile(54, { x: Game.CELL, y: 0 });
		} else {
			renderer.drawTile(43, { x: 0, y: 0 });
			renderer.drawTile(44, { x: Game.CELL, y: 0 });
		}
		renderer.ctx.restore();
	}

	renderRollEastSouth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES * 3) {
			this.state = State.Idle;
			game.input.keys[Input.DOWN].pressed = true;
		}

		const frame = Math.floor(this.frames / Battery.ANIMATION_FRAMES);

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		if (frame === 0) {
			renderer.drawTile(63, { x: 0, y: 0 });
			renderer.drawTile(64, { x: Game.CELL, y: 0 });
			renderer.drawTile(53, { x: 0, y: -Game.CELL });
			renderer.drawTile(54, { x: Game.CELL, y: -Game.CELL });
		} else if (frame === 1) {
			renderer.drawTile(83, { x: 0, y: 0 });
			renderer.drawTile(84, { x: Game.CELL, y: 0 });
			renderer.drawTile(73, { x: 0, y: -Game.CELL });
			renderer.drawTile(74, { x: Game.CELL, y: -Game.CELL });
		} else {
			renderer.drawTile(43, { x: 0, y: 0 });
			renderer.drawTile(44, { x: Game.CELL, y: 0 });
		}
		renderer.ctx.restore();
	}

	renderRollWestNorth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES * 3) {
			this.state = State.Idle;
			game.input.keys[Input.UP].pressed = true;
		}

		const frame = Math.floor(this.frames / Battery.ANIMATION_FRAMES);

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		if (frame === 0) {
			renderer.drawTile(81, { x: 0, y: Game.CELL });
			renderer.drawTile(82, { x: Game.CELL, y: Game.CELL });
			renderer.drawTile(71, { x: 0, y: 0 });
			renderer.drawTile(72, { x: Game.CELL, y: 0 });
		} else if (frame === 1) {
			renderer.drawTile(61, { x: 0, y: Game.CELL });
			renderer.drawTile(62, { x: Game.CELL, y: Game.CELL });
			renderer.drawTile(51, { x: 0, y: 0 });
			renderer.drawTile(52, { x: Game.CELL, y: 0 });
		} else {
			renderer.drawTile(33, { x: 0, y: 0 });
			renderer.drawTile(34, { x: Game.CELL, y: 0 });
		}
		renderer.ctx.restore();
	}

	renderRollWestSouth(game: Game) {
		const renderer = game.renderer;

		if (this.frames >= Battery.ANIMATION_FRAMES * 3) {
			this.state = State.Idle;
			game.input.keys[Input.DOWN].pressed = true;
		}

		const frame = Math.floor(this.frames / Battery.ANIMATION_FRAMES);

		renderer.ctx.save();
		renderer.ctx.translate(this.position.x, this.position.y);
		if (frame === 0) {
			renderer.drawTile(61, { x: 0, y: 0 });
			renderer.drawTile(62, { x: Game.CELL, y: 0 });
			renderer.drawTile(51, { x: 0, y: -Game.CELL });
			renderer.drawTile(52, { x: Game.CELL, y: -Game.CELL });
		} else if (frame === 1) {
			renderer.drawTile(81, { x: 0, y: 0 });
			renderer.drawTile(82, { x: Game.CELL, y: 0 });
			renderer.drawTile(71, { x: 0, y: -Game.CELL });
			renderer.drawTile(72, { x: Game.CELL, y: -Game.CELL });
		} else {
			renderer.drawTile(33, { x: 0, y: 0 });
			renderer.drawTile(34, { x: Game.CELL, y: 0 });
		}
		renderer.ctx.restore();
	}
}

export { Battery };
