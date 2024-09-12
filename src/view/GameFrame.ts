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

	public getCanvas(): HTMLCanvasElement {
		if (!this.canvas) {
			throw new Error("Canvas not initialized");
		}
		return this.canvas;
	}

	public getContext(): CanvasRenderingContext2D {
		if (!this.context) {
			throw new Error("Context not initialized");
		}
		return this.context;
	}
}
