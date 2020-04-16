class Game {
	width: number = 256;
	height: number = 224;
	scale: number = 1;

	domElement: HTMLElement;

	constructor(domElement: HTMLElement) {
		this.domElement = domElement;

		this.resize();

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
	}
}

const game = new Game(document.querySelector(".game") as HTMLElement);

export { game };
