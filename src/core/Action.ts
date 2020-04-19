import { game, Game } from "~/index";

export type Updater = (game: Game, t: number) => void;

class Action extends Promise<void> {
	private updater: Updater;
	private resolve: (value?: void | PromiseLike<void> | undefined) => void;
	readonly duration: number;
	protected timeLeft: number;
	running: boolean;
	finished: boolean;

	constructor(updater: Updater, duration: number) {
		let _resolve;
		super((resolve) => (_resolve = resolve));
		// @ts-ignore
		this.resolve = _resolve;

		game.actions.push(this);

		this.updater = updater;
		this.duration = duration;
		this.timeLeft = duration;
		this.running = true;
		this.finished = false;
	}

	update(game: Game) {
		if (this.finished || !this.running) {
			return;
		}

		this.timeLeft = Math.max(this.timeLeft - game.clock.delta, 0);

		if (this.timeLeft === 0) {
			this.resolve();
			this.running = false;
			this.finished = true;
			return;
		}

		const t = 1 - this.timeLeft / this.duration;
		this.updater(game, t);
	}

	finish() {
		this.timeLeft = 0;
		this.running = false;
		this.finished = true;
		this.resolve();
	}
}

export { Action };
