import { Tiled } from "~/@types/Tiled";
import { VectorLike } from "./Vector";
import { Game } from "~";

class Renderer {
	readonly flagHorizontal = 0x80000000;
	readonly flagVertical = 0x40000000;
	readonly flagDiagonal = 0x20000000;

	public scale: number = 1;
	public width: number = 0;
	public height: number = 0;

	public tilesets: Tiled.Tileset[] = [];

	game: Game;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	constructor(game: Game) {
		this.game = game;

		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		this.canvas.style.imageRendering = "pixelated";
		this.canvas.style.imageRendering = "crisp-edges";
		this.ctx.imageSmoothingEnabled = false;
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

	drawTile(
		gid: number,
		position: VectorLike,
		scale: VectorLike = { x: 1, y: 1 },
		angle: number = 0
	) {
		const tileset = this.tileset(gid);
		const image = this.game.assets.images[tileset.name];
		const index = this.unflag(gid) - tileset.firstgid;
		const sx = (index % tileset.columns) * tileset.tilewidth;
		const sy = Math.floor(index / tileset.columns) * tileset.tilewidth;

		this.ctx.save();

		this.ctx.translate(position.x, position.y);
		this.ctx.translate(tileset.tilewidth / 2, tileset.tileheight / 2);
		this.ctx.scale(scale.x, scale.y);
		this.ctx.rotate((angle * Math.PI) / 180);

		this.flip(gid);

		this.ctx.drawImage(
			image,
			sx,
			sy,
			tileset.tilewidth,
			tileset.tileheight,
			-tileset.tilewidth / 2,
			-tileset.tileheight / 2,
			tileset.tilewidth,
			tileset.tileheight
		);

		this.ctx.restore();
	}

	private tileset(_gid: number): Tiled.Tileset {
		const gid = this.unflag(_gid);

		for (const tileset of this.tilesets) {
			const { firstgid, tilecount } = tileset;
			if (gid >= firstgid && gid < firstgid + tilecount) {
				return tileset;
			}
		}

		throw new Error(`No tileset found for gid: ${gid}`);
	}

	public unflag(gid: number): number {
		return gid & ~(this.flagHorizontal | this.flagVertical | this.flagDiagonal);
	}

	private flip(gid: number): void {
		const horizontal = !!(gid & this.flagHorizontal);
		const vertical = !!(gid & this.flagVertical);
		const diagonal = !!(gid & this.flagDiagonal);

		let angle = 0;
		let scale = [1, 1];

		if (!horizontal && vertical && diagonal) {
			angle = 270;
		}
		if (horizontal && vertical && !diagonal) {
			angle = 180;
		}
		if (horizontal && !vertical && diagonal) {
			angle = 90;
		}
		if (!horizontal && vertical && !diagonal) {
			scale[1] = -1;
		}
		if (horizontal && vertical && diagonal) {
			scale[1] = -1;
			angle = 90;
		}
		if (horizontal && !vertical && !diagonal) {
			scale[0] = -1;
		}
		if (!horizontal && !vertical && diagonal) {
			scale[0] = -1;
			angle = 90;
		}

		this.ctx.scale(scale[0], scale[1]);
		this.ctx.rotate((angle * Math.PI) / 180);
	}
}

export { Renderer };
