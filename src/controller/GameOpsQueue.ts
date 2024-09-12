import { Movable } from "../model/Movable";
import { Action, GameOp } from "./GameOp";

export class GameOpsQueue {
	private list: LinkedList<GameOp>;

	constructor() {
		this.list = new LinkedList();
	}

	public enqueue(movable: Movable, action: Action) {
		this.list.enqueue(new GameOp(movable, action));
	}

	public dequeue(): GameOp | null {
		return this.list.dequeue();
	}
}
