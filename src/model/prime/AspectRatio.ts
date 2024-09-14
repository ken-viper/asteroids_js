export class AspectRatio {
	private width: number;
	private height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public scale(scale: number): AspectRatio {
		this.width *= scale;
		this.height *= scale;
		return this;
	}

	getWidth(): number {
		return this.width;
	}

	getHeight(): number {
		return this.height;
	}

	setWidth(width: number): void {
		this.width = width;
	}

	setHeight(height: number): void {
		this.height = height;
	}
}
