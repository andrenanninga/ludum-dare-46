class Clock {
	start: number;
	current: number;
	elapsed: number;
	delta: number;
	frame: number;

	constructor() {
		this.start = performance.now();
		this.current = performance.now();
		this.elapsed = 0;
		this.delta = 0;
		this.frame = 0;
	}

	update() {
		const now = performance.now();

		this.delta = now - this.current;
		this.elapsed = now - this.start;
		this.current = now;
		this.frame += 1;
	}
}

export { Clock };
