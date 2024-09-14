import { CommandCenter } from "../controller/CommandCenter";
import { SoundLoader } from "../controller/SoundLoader";
import { Falcon } from "./Falcon";
import { Floater } from "./Floater";
import { Movable } from "./Movable";
import { LinkedList } from "./prime/LinkedList";

export class NukeFloater extends Floater {
	// Spawn every 12 seconds
	public static SPAWN_NUKE_FLOATER: number = 175;

	// FPS added in constructor (instead of static instantiation) to prevent accessing an undefined value
	constructor() {
		super();
		this.setColor("yellow");
		this.setExpiry(120);
	}

	public removeFromGame(list: LinkedList<Movable>): void {
		super.removeFromGame(list);

		if (this.getExpiry() > 0) {
			SoundLoader.playSound("nuke-up.wav");
			CommandCenter.getInstance().getFalcon().setNukeMeter(Falcon.MAX_NUKE);
		}
	}
}
