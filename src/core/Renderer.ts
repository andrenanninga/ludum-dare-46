class Renderer {
	scale: number = 1;
	width: number = 0;
	height: number = 0;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	private bufferCanvas: HTMLCanvasElement;
	private bufferCtx: CanvasRenderingContext2D;

	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d", {
			alpha: false,
		}) as CanvasRenderingContext2D;

		this.bufferCanvas = document.createElement("canvas");
		this.bufferCtx = this.bufferCanvas.getContext(
			"2d"
		) as CanvasRenderingContext2D;

		this.bufferCanvas.width = 1024;
		this.bufferCanvas.height = 1024;

		this.canvas.style.imageRendering = "pixelated";
		this.canvas.style.imageRendering = "crisp-edges";
		this.ctx.imageSmoothingEnabled = false;

		this.bufferCanvas.style.imageRendering = "pixelated";
		this.bufferCanvas.style.imageRendering = "crisp-edges";
		this.bufferCtx.imageSmoothingEnabled = false;
	}

	resize(width: number, height: number, scale: number) {
		this.width = width;
		this.height = height;
		this.scale = scale;

		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.width = `${this.width * this.scale}px`;
		this.canvas.style.height = `${this.height * this.scale}px`;
	}
}

export { Renderer };
