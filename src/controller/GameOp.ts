import { Movable } from "../model/Movable";

export enum Action {
	ADD,
	REMOVE,
}

export class GameOp {
	private movable: Movable;
	private action: Action;

	constructor(movable: Movable, action: Action) {
		this.movable = movable;
		this.action = action;
	}

	public getMovable(): Movable {
		return this.movable;
	}

	public getAction(): Action {
		return this.action;
	}

	public setMovable(movable: Movable): void {
		this.movable = movable;
	}

	public setAction(action: Action): void {
		this.action = action;
	}
}
