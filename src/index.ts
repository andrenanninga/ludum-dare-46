import { Clock } from "~/core/Clock";
import { Entity } from "~/entities/Entity";
import { Input } from "~/core/Input";
import { Renderer } from "~/core/Renderer";
import { Level } from "./core/Level";
import { loadImages } from "./core/loaders/images";
import { loadLevels } from "./core/loaders/levels";
import { Action } from "./core/Action";

export enum State {
	Boot = "Boot",
	Menu = "Menu",
	Playing = "Playing",
	Paused = "Paused",
}

class Game {
	static CELL = 16;

	width: number = 160;
	height: number = 144;
	scale: number = 1;

	state: State = State.Boot;

	domElement: HTMLElement;

	clock: Clock;
	input: Input;
	renderer: Renderer;
	assets: {
		images: { [name: string]: HTMLImageElement };
		levels: { [name: string]: Level };
	};
	actions: Action[];
	entities: Entity[];
	loadDelay: number;

	constructor(domElement: HTMLElement) {
		this.domElement = domElement;

		this.clock = new Clock();
		this.input = new Input();
		this.renderer = new Renderer(this);
		this.domElement.appendChild(this.renderer.canvas);

		this.entities = [];
		this.actions = [];
		this.assets = { images: {}, levels: {} };
		this.loadDelay = 0;

		this.resize();
		this.init();

		window.addEventListener("resize", () => this.resize());
	}

	private resize() {
		const widthRatio = window.innerWidth / this.width;
		const heightRatio = window.innerHeight / (this.height + 50);

		this.scale = Math.min(4, Math.floor(Math.min(widthRatio, heightRatio)));

		this.domElement.style.width = `${this.width * this.scale}px`;
		this.domElement.style.height = `${this.height * this.scale}px`;

		this.renderer.resize(this.width, this.height, this.scale);
	}

	private async init() {
		this.assets.images = await loadImages();
		this.assets.levels = loadLevels();

		this.loadLevel("boot");

		requestAnimationFrame(() => {
			this.update();
			this.render();
		});
	}

	public loadLevel(name: string): Level {
		this.entities = [];
		this.assets.levels[name].init(this);
		this.entities.push(this.assets.levels[name]);

		this.loadDelay = 0;

		this.state = State.Playing;
		return this.assets.levels[name];
	}

	private update() {
		this.clock.update();

		this.actions.forEach((action) => {
			action.update(this);
		});

		this.entities.forEach((entity) => {
			entity.update(this);
		});

		this.input.update();

		this.actions = this.actions.filter((action) => action.running);

		requestAnimationFrame(() => {
			this.update();
			this.render();
		});

		this.loadDelay = Math.max(this.loadDelay - 1, 0);
	}

	private render() {
		this.renderer.ctx.clearRect(0, 0, this.width, this.height);
		this.renderer.ctx.fillStyle = "#21283b";
		this.renderer.ctx.fillRect(0, 0, this.width, this.height);

		if (this.loadDelay === 0) {
			this.entities.forEach((entity) => {
				entity.render(this);
			});
		} else {
			const frame = Math.floor(this.loadDelay / 6) % 8;

			if (frame === 0) {
				this.renderer.drawTile(33, { x: 56, y: 64 });
				this.renderer.drawTile(34, { x: 72, y: 64 });
			} else if (frame === 1 || frame === 7) {
				this.renderer.drawTile(5, { x: 56, y: 48 });
				this.renderer.drawTile(6, { x: 72, y: 48 });
				this.renderer.drawTile(15, { x: 56, y: 64 });
				this.renderer.drawTile(16, { x: 72, y: 64 });
			} else if (frame === 2 || frame === 6) {
				this.renderer.drawTile(31, { x: 72, y: 48 });
				this.renderer.drawTile(41, { x: 72, y: 64 });
			} else if (frame === 3 || frame === 5) {
				this.renderer.drawTile(3, { x: 72, y: 48 });
				this.renderer.drawTile(4, { x: 88, y: 48 });
				this.renderer.drawTile(13, { x: 72, y: 64 });
				this.renderer.drawTile(14, { x: 88, y: 64 });
			} else if (frame === 4) {
				this.renderer.drawTile(43, { x: 72, y: 64 });
				this.renderer.drawTile(44, { x: 88, y: 64 });
			}
		}
	}
}

const game = new Game(document.querySelector(".game") as HTMLElement);
const renderer = game.renderer;
const clock = game.clock;

window.game = game;

export { Game, clock, renderer, game };
