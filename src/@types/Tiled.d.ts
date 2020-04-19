export declare namespace Tiled {
	interface Map {
		height: number;
		width: number;
		infinite: boolean;
		layers: Layer[];
		tileheight: number;
		tilewidth: number;
		tilesets: Tileset[];
		version: number;
		editorsettings: {
			chunksize: {
				width: number;
				height: number;
			};
		};
	}

	type Layer = {
		name: string;
		id: number;
		visible: boolean;
		opacity: number;
		type: string;
		x: number;
		y: number;
	} & (TileLayer | ObjectGroup);

	interface TileLayer {
		height: number;
		width: number;
		data: number[];
		type: "tilelayer";
	}

	interface ObjectGroup {
		type: "objectgroup";
		objects: Object[];
	}

	interface Object {
		id: number;
		gid?: number;
		height: number;
		width: number;
		name: string;
		type: string;
		rotation: number;
		visible: boolean;
		properties: Property[];
		x: number;
		y: number;
	}

	interface Chunk {
		data: number[];
		height: number;
		width: number;
		x: number;
		y: number;
	}

	interface Tileset {
		columns: number;
		firstgid: number;
		image: string;
		imageheight: number;
		imagewidth: number;
		margin: number;
		name: string;
		spacing: number;
		tiles?: Array<{
			id: number;
			properties?: Property[];
		}>;
		tilecount: number;
		tileheight: number;
		tilewidth: number;
	}

	type Property = {
		name: string;
	} & {
		type: "string" | "color";
		value: string;
	} & {
		type: "bool";
		value: boolean;
	} & {
		type: "float" | "int" | "object";
		value: number;
	};
}
