import { Team } from "./Movable";
import { Point } from "./prime/Point";
import { Sprite } from "./Sprite";

export abstract class Floater extends Sprite {
	constructor() {
		super();
		this.setTeam(Team.FLOATER);

		// Default values, can be overridden
		this.setExpiry(250);
		this.setColor("white");
		this.setRadius(50);
		this.setDeltaX(this.somePosNegValue(10));
		this.setDeltaY(this.somePosNegValue(10));
		this.setSpin(this.somePosNegValue(10));

		const listPoints: Point[] = [];
		listPoints.push(new Point(5, 5));
		listPoints.push(new Point(4, 0));
		listPoints.push(new Point(5, -5));
		listPoints.push(new Point(0, -4));
		listPoints.push(new Point(-5, -5));
		listPoints.push(new Point(-4, 0));
		listPoints.push(new Point(-5, 5));
		listPoints.push(new Point(0, 4));
		this.setCartesians(listPoints);
	}

	draw(g: CanvasRenderingContext2D): void {
		this.renderVector(g);
	}
}
