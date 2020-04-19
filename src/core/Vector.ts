import { Game } from "~";

export type VectorLike = { x: number; y: number };

class Vector {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	static isVectorLike(vector: VectorLike): vector is VectorLike {
		return "x" in vector && "y" in vector;
	}

	add(other: VectorLike): Vector;
	add(x: number, y: number): Vector;
	add(a: any, b?: any): Vector {
		if (Vector.isVectorLike(a)) {
			this.x += a.x;
			this.y += a.y;
		} else {
			this.x += a;
			this.y += b;
		}

		return this;
	}

	cell(): Vector {
		return new Vector(this.x / Game.CELL, this.y / Game.CELL);
	}

	clone(): Vector {
		return new Vector(this.x, this.y);
	}

	equal(other: VectorLike): boolean {
		return this.x === other.x && this.y === other.y;
	}

	copy(other: VectorLike): Vector {
		this.x = other.x;
		this.y = other.y;

		return this;
	}

	set(x: number, y: number): Vector {
		this.x = x;
		this.y = y;

		return this;
	}

	real(): Vector {
		return new Vector(this.x * Game.CELL, this.y * Game.CELL);
	}

	subtract(other: VectorLike): Vector;
	subtract(x: number, y: number): Vector;
	subtract(a: any, b?: any): Vector {
		if (Vector.isVectorLike(a)) {
			this.x -= a.x;
			this.y -= a.y;
		} else {
			this.x -= a;
			this.y -= b;
		}

		return this;
	}
}

export { Vector };
