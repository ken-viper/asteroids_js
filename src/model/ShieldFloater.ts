import { CommandCenter } from "../controller/CommandCenter";
import { Game } from "../controller/Game";
import { Falcon } from "./Falcon";
import { Floater } from "./Floater";
import { Movable } from "./Movable";
import { LinkedList } from "./prime/LinkedList";

export class ShieldFloater extends Floater {
	// Spawn every 25 seconds
	public static SPAWN_SHIELD_FLOATER: number = 25;

	constructor(fps: number) {
		super();
		this.setColor("cyan");
		this.setExpiry(260);

		ShieldFloater.SPAWN_SHIELD_FLOATER *= fps;
	}

	public removeFromGame(list: LinkedList<Movable>): void {
		super.removeFromGame(list);

		if (this.getExpiry() > 0) {
			// TODO: Play sound "nuke-up.wav"
			CommandCenter.getInstance().getFalcon().setShield(Falcon.MAX_SHIELD);
		}
	}
}
