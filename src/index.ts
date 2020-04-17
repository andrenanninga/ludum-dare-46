import { Clock } from "./core/Clock";
import { Renderer } from "./core/Renderer";

class Game {
	width: number = 256;
	height: number = 224;
	scale: number = 1;

	domElement: HTMLElement;

	clock: Clock;
	renderer: Renderer;

	constructor(domElement: HTMLElement) {
		this.domElement = domElement;

		this.clock = new Clock();
		this.renderer = new Renderer();
		this.domElement.appendChild(this.renderer.canvas);

		this.resize();
		this.init();

		window.addEventListener("resize", () => this.resize());
	}

	resize() {
		const widthRatio = window.innerWidth / this.width;
		const heightRatio = window.innerHeight / this.height;

		this.scale = Math.floor(Math.min(widthRatio, heightRatio));

		document.body.style.backgroundColor = "#fbf5ef";
		this.domElement.style.backgroundColor = "#f2d3ab";
		this.domElement.style.width = `${this.width * this.scale}px`;
		this.domElement.style.height = `${this.height * this.scale}px`;

		this.renderer.resize(this.width, this.height, this.scale);
	}

	init() {
		requestAnimationFrame(() => this.update());
	}

	update() {
		this.renderer.ctx.clearRect(0, 0, this.width, this.height);
		this.renderer.ctx.fillStyle = "white";
		this.renderer.ctx.fillRect(0, 0, this.width, this.height);

		this.clock.update();

		this.renderer.ctx.fillStyle = "black";
		this.renderer.ctx.font = "20px monospace";
		this.renderer.ctx.fillText(`${this.clock.frame}`, 20, 20);

		requestAnimationFrame(() => this.update());
	}
}

const game = new Game(document.querySelector(".game") as HTMLElement);
const renderer = game.renderer;
const clock = game.clock;

export { clock, renderer, game };
