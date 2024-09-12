import { Movable } from "../model/Movable";

export enum GameOpAction {
	ADD,
	REMOVE,
}

export class GameOp {
	private movable: Movable;
	private action: GameOpAction;

	constructor(movable: Movable, action: GameOpAction) {
		this.movable = movable;
		this.action = action;
	}

	public getMovable(): Movable {
		return this.movable;
	}

	public getAction(): GameOpAction {
		return this.action;
	}

	public setMovable(movable: Movable): void {
		this.movable = movable;
	}

	public setAction(action: GameOpAction): void {
		this.action = action;
	}
}
