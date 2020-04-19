import { Level } from "~/core/Level";
// @ts-ignore
import jsons from "../../assets/*.json";

interface Levels {
	[name: string]: Level;
}

function loadLevels(): Levels {
	const levels: Levels = {};

	Object.keys(jsons).map((name) => {
		const level = new Level(name, jsons[name]);

		levels[name] = level;
	});

	return levels;
}

export { loadLevels };
