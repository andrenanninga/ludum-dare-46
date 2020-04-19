// @ts-ignore
import pngs from "../../assets/*.png";

interface Images {
	[key: string]: HTMLImageElement;
}

async function loadImages(): Promise<Images> {
	const images: Images = {};

	await Promise.all(
		Object.keys(pngs).map(async (name) => {
			const image = await new Promise<HTMLImageElement>((resolve, reject) => {
				const image = new Image();
				image.onload = () => resolve(image);
				image.onerror = () => reject();
				image.src = pngs[name];
			});

			images[name] = image;
		})
	);

	return images;
}

export { loadImages };
