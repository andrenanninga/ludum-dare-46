import { Tiled } from "~/@types/Tiled";
import { Entity } from "~/entities/Entity";
import { Tile } from "~/entities/Tile";
import { Vector, VectorLike } from "./Vector";
import { Game, game } from "~";
import { Battery } from "~/entities/Battery";
import { Socket } from "~/entities/Socket";
import { Orientation } from "~/@types/Orientation";
import { Circuit } from "~/entities/Circuit";
import { Counter } from "~/entities/Counter";
import { Input } from "./Input";

class Level {
	name: string;
	map: Tiled.Map;
	entities: Entity[];
	solid: { [xy: string]: boolean };
	winning: number;

	constructor(name: string, map: Tiled.Map) {
		this.name = name;
		this.map = map;

		this.entities = [];
		this.solid = {};
		this.winning = 0;
	}

	init(game: Game) {
		game.renderer.tilesets = this.map.tilesets;
		this.entities = [];

		this.map.layers.forEach((layer) => {
			switch (layer.type) {
				case "tilelayer":
					this.loadTilelayer(game, layer);
					break;

				case "objectgroup":
					this.loadObjectgroup(layer);
					break;
			}
		});

		setTimeout(() => {
			if (
				game.entities[0].name === "boot" ||
				game.entities[0].name === "credits"
			) {
				game.input.keys["ArrowLeft"] = { pressed: true };
			}
		}, 400);
	}

	restart(game: Game) {
		this.init(game);
	}

	update(game: Game) {
		this.entities.forEach((entity) => {
			entity.update(game);
		});

		this.checkWinCondition();
		if (this.name === "boot" || this.name === "credits") {
			if (game.input.released(Input.ANY)) {
				game.loadLevel("menu");
			}
		} else if (this.name === "menu") {
			if (game.input.released(Input.START)) {
				const battery = this.getBattery();
				if (battery.position.x === 16 && battery.position.y === 16) {
					game.loadLevel("1-first");
				}
				if (battery.position.x === 32 && battery.position.y === 80) {
					game.loadLevel("2-second");
				}
				if (battery.position.x === 80 && battery.position.y === 112) {
					game.loadLevel("3-third");
				}
				if (battery.position.x === 112 && battery.position.y === 112) {
					game.loadLevel("4-fourth");
				}
				if (battery.position.x === 112 && battery.position.y === 48) {
					game.loadLevel("5-fifth");
				}
			}
		} else {
			if (game.input.released(Input.RESET)) {
				this.restart(game);
				return;
			}

			if (this.winning >= 179 || game.input.released(Input.ESCAPE)) {
				const nextLevel = game.loadLevel("menu");
				const battery = nextLevel.getBattery();
				if (this.name === "1-first") {
					battery.position.set(16, 16);
					battery.orientation = Orientation.East;
				} else if (this.name === "2-second") {
					battery.position.set(32, 80);
					battery.orientation = Orientation.West;
				} else if (this.name === "3-third") {
					battery.position.set(80, 112);
					battery.orientation = Orientation.North;
				} else if (this.name === "4-fourth") {
					battery.position.set(112, 112);
					battery.orientation = Orientation.East;
				} else if (this.name === "5-fifth") {
					game.loadLevel("credits");
				}
			}
		}
	}

	render(game: Game) {
		this.entities.forEach((entity) => {
			entity.render(game);
		});

		// Object.keys(this.solid).forEach((key) => {
		// 	const [x, y] = key.split("-");

		// 	if (this.solid[key]) {
		// 		game.renderer.ctx.strokeStyle = "#ffff00";
		// 		game.renderer.ctx.strokeRect(
		// 			x * Game.CELL,
		// 			y * Game.CELL,
		// 			Game.CELL,
		// 			Game.CELL
		// 		);
		// 	}
		// });
	}

	isSolid(cell: VectorLike): boolean {
		if (cell.x < 0 || cell.y < 0 || cell.x >= 10 || cell.y >= 8) {
			return true;
		}

		return this.solid[`${cell.x}-${cell.y}`] || false;
	}

	markSolid(cell: VectorLike, solid: boolean = true) {
		this.solid[`${cell.x}-${cell.y}`] = solid;
	}

	getBattery(): Battery {
		return this.entities.filter(
			(entity) => entity instanceof Battery
		)[0] as Battery;
	}

	private checkWinCondition() {
		const batteries = this.entities.filter(
			(entity) => entity instanceof Battery
		) as Battery[];
		const sockets = this.entities.filter(
			(entity) => entity instanceof Socket
		) as Socket[];

		this.entities.forEach((entity) => {
			if (entity instanceof Socket) {
				entity.powered = false;
			}
		});

		const matches = batteries
			.map((battery) => {
				const isInSocket = sockets.filter(
					(socket) =>
						battery.position.x === socket.position.x &&
						battery.position.y === socket.position.y &&
						battery.orientation === socket.orientation
				)[0];

				battery.connected = !!isInSocket;
				if (isInSocket) {
					isInSocket.powered = true;
				}

				return !!isInSocket;
			})
			.filter((match) => match);

		if (matches.length > 0 && matches.length === sockets.length) {
			this.winning += 1;
		} else {
			this.winning = 0;
		}
	}

	private loadTilelayer(game: Game, layer: Tiled.TileLayer) {
		layer.data.forEach((gid, index) => {
			if (gid === 0) {
				return;
			}

			const id = game.renderer.unflag(gid);
			const x = (index % layer.width) * Game.CELL;
			const y = Math.floor(index / layer.width) * Game.CELL;
			const cell = new Vector(x, y);

			if (id === 158 || id === 159) {
				const circuit = new Circuit(this, cell, gid);
				this.entities.push(circuit);
			} else {
				const tile = new Tile(cell, gid);
				this.entities.push(tile);
				this.markSolid({ x: x / Game.CELL, y: y / Game.CELL }, tile.solid);
			}
		});
	}

	private loadObjectgroup(layer: Tiled.ObjectGroup) {
		layer.objects.forEach((object) => {
			const type = (object.type || object.name || "").toLowerCase();

			const x = object.x;
			const y = object.y - Game.CELL;
			const position = new Vector(x, y);

			switch (type) {
				case "battery": {
					const battery = new Battery(
						position,
						this.orientationFromGid(object.gid || 0),
						this
					);
					this.entities.push(battery);
					break;
				}

				case "socket": {
					const socket = new Socket(
						position,
						this.orientationFromGid(object.gid || 0),
						this
					);
					this.entities.push(socket);
					break;
				}

				case "counter": {
					const counter = new Counter(position.clone().add({ x: 0, y: 0 }));
					this.entities.push(counter);
					break;
				}
			}
		});
	}

	private orientationFromGid(gid: number): Orientation {
		switch (gid) {
			case 11:
			case 55:
				return Orientation.North;

			case 12:
			case 56:
				return Orientation.East;

			case 22:
			case 66:
				return Orientation.South;

			case 21:
			case 65:
				return Orientation.West;

			default:
				throw new Error(`Cannot get orientation from gid: ${gid}`);
		}
	}
}

export { Level };
