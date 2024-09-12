interface GameFrameDimensions {
	width: number;
	height: number;
}

export class GameFrame {
	private canvas: HTMLCanvasElement | undefined;
	private context: CanvasRenderingContext2D | undefined;

	constructor(dimensions: GameFrameDimensions) {
		try {
			this.initialize(dimensions);
		} catch (error) {
			console.error(error);
		}
	}

	private initialize(dimensions: GameFrameDimensions): void {
		this.canvas = document.createElement("canvas");
		this.canvas.width = dimensions.width;
		this.canvas.height = dimensions.height;
		document.body.appendChild(this.canvas);

		this.context = this.canvas.getContext("2d")!;
		if (!this.context) {
			throw new Error("Failed to get 2D rendering context");
		}
	}
}
