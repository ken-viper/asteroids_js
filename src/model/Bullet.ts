import { Falcon } from "./Falcon";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { Point } from "./prime/Point";
import { Sprite } from "./Sprite";

export class Bullet extends Sprite {
	constructor(falcon: Falcon) {
		super();
		this.setTeam(Team.FRIEND);
		this.setColor("orange");
		this.setExpiry(20);
		this.setRadius(6);
		this.setCenter(new Point(falcon.getCenter().getX(), falcon.getCenter().getY()));
		this.setOrientation(falcon.getOrientation());

		const FIRE_POWER: number = 35;
		const vectorX = Math.cos((Math.PI / 180) * this.getOrientation()) * FIRE_POWER;
		const vectorY = Math.sin((Math.PI / 180) * this.getOrientation()) * FIRE_POWER;
		this.setDeltaX(falcon.getDeltaX() + vectorX);
		this.setDeltaY(falcon.getDeltaY() + vectorY);

		// Initial kickback divisor was 36, decreased to for more kickback
		const KICK_BACK_DIVISOR = 24;
		falcon.setDeltaX(falcon.getDeltaX() - vectorX / KICK_BACK_DIVISOR);
		falcon.setDeltaY(falcon.getDeltaY() - vectorY / KICK_BACK_DIVISOR);

		let listPoints: Point[] = [];
		listPoints.push(new Point(0, 3));
		listPoints.push(new Point(1, -1));
		listPoints.push(new Point(0, 0));
		listPoints.push(new Point(-1, -1));
		this.setCartesians(listPoints);
	}

	public draw(g: CanvasRenderingContext2D): void {
		this.renderVector(g);
	}

	public addToGame(list: LinkedList<Movable>): void {
		super.addToGame(list);
		// TODO: Play sound when bullet is fired ("thump.wav")
	}
}
