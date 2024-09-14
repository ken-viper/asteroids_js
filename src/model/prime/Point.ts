export class Point {
	private x: number;
	private y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public distanceTo(other: Point): number {
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
	}

    public  clone(): Point {
        return new Point(this.x, this.y)
    }

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}

	public setX(x: number): void {
		this.x = x;
	}

	public setY(y: number): void {
		this.y = y;
	}
}
