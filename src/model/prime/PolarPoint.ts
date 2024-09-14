export class PolarPoint {
	private r;
	private theta;

	constructor(r: number, theta: number) {
		this.r = r;
		this.theta = theta;
	}

	public compareTheta(other: PolarPoint): number {
		if (this.theta < other.theta) {
			return -1;
		}
		if (this.theta > other.theta) {
			return 1;
		}

		return 0;
	}

	public getR(): number {
		return this.r;
	}

	public getTheta(): number {
		return this.theta;
	}

	public setR(r: number): void {
		this.r = r;
	}

	public setTheta(theta: number): void {
		this.theta = theta;
	}
}
