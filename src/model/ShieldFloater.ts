import { CommandCenter } from "../controller/CommandCenter";
import { SoundLoader } from "../controller/SoundLoader";
import { Falcon } from "./Falcon";
import { Floater } from "./Floater";
import { Movable } from "./Movable";
import { LinkedList } from "./prime/LinkedList";

export class ShieldFloater extends Floater {
	// Spawn every 25 seconds
	public static SPAWN_SHIELD_FLOATER: number = 350;

	constructor() {
		super();
		this.setColor("cyan");
		this.setExpiry(260);
	}

	public removeFromGame(list: LinkedList<Movable>): void {
		super.removeFromGame(list);

		if (this.getExpiry() > 0) {
			SoundLoader.playSound("nuke-up.wav");
			CommandCenter.getInstance().getFalcon().setShield(Falcon.MAX_SHIELD);
		}
	}
}
