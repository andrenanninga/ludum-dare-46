class Input {
	keys: {
		[key: string]: {
			pressed: boolean;
			down: boolean;
			released: boolean;
		};
	};

	static UP = "ArrowUp";
	static DOWN = "ArrowDown";
	static RIGHT = "ArrowRight";
	static LEFT = "ArrowLeft";
	static RESET = "r";
	static START = ["r", " "];
	static ANY = [" ", "Enter", "Control", "Meta", "Alt"];
	static ESCAPE = ["Escape"];

	constructor() {
		this.keys = {};

		document.addEventListener("keydown", this.keydown);
		document.addEventListener("keyup", this.keyup);
	}

	down(key: string | string[]): boolean {
		if (typeof key === "string") {
			return this.keys[key]?.down || false;
		}

		return key.filter((k) => this.keys[k]?.down || false).length >= 1;
	}

	pressed(key: string | string[]): boolean {
		if (typeof key === "string") {
			return this.keys[key]?.pressed || false;
		}

		return key.filter((k) => this.keys[k]?.pressed || false).length >= 1;
	}

	released(key: string | string[]): boolean {
		if (typeof key === "string") {
			return this.keys[key]?.released || false;
		}

		return key.filter((k) => this.keys[k]?.released || false).length >= 1;
	}

	update() {
		Object.keys(this.keys).forEach((key) => {
			this.keys[key].pressed = false;
			this.keys[key].released = false;
		});
	}

	dispose() {
		document.removeEventListener("keydown", this.keydown);
		document.removeEventListener("keyup", this.keyup);
	}

	keydown = (e: KeyboardEvent) => {
		if (e.repeat) {
			return;
		}

		this.keys[e.key] = this.keys[e.key] || {};
		this.keys[e.key].pressed = true;
		this.keys[e.key].down = true;
		this.keys[e.key].released = false;
	};

	keyup = (e: KeyboardEvent) => {
		this.keys[e.key] = this.keys[e.key] || {};
		this.keys[e.key].pressed = false;
		this.keys[e.key].down = false;
		this.keys[e.key].released = true;
	};
}

export { Input };
