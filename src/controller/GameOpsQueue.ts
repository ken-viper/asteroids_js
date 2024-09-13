import { Movable } from "../model/Movable";
import { LinkedList } from "../model/prime/LinkedList";
import { GameOpAction, GameOp } from "./GameOp";

export class GameOpsQueue {
	private list: LinkedList<GameOp>;

	constructor() {
		this.list = new LinkedList();
	}

	public enqueue(movable: Movable, action: GameOpAction): void {
		this.list.enqueue(new GameOp(movable, action));
	}

	public dequeue(): GameOp | null {
		if (this.isEmpty()) {
			throw new Error("Cannot dequeue from an empty queue");
		}
		return this.list.dequeue();
	}

	public isEmpty(): boolean {
		return this.list.length === 0;
	}
}
