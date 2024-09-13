export class ImageLoader {
	private static IMAGE_MAP: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();

	static {
		ImageLoader.loadImages();
	}

	public static loadImages(): void {
		const context = (require as any).context("../assets/imgs", true, /\.(png)$/);

		context.keys().forEach((key: string) => {
			const imageName = key.replace("./", "");
			const imageUrl = context(key);
			const img = new Image();
			img.src = imageUrl;

			img.onload = () => {
				ImageLoader.IMAGE_MAP.set(imageName.toLowerCase(), img);
			};
		});
	}

	public static getImage(imagePath: string): HTMLImageElement | undefined {
		return ImageLoader.IMAGE_MAP.get(imagePath.toLowerCase());
	}
}
