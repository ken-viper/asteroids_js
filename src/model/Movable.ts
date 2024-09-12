import { Point } from "./prime/Point";

export enum Team {
	FRIEND,
	FOE,
	FLOATER,
	DEBRIS,
}

export interface Movable {
	move(): void;
	draw(): void;

	getCenter(): Point;
	getRadius(): number;
	getTeam(): Team;

	addToGame(list: LinkedList<Movable>): void;
	removeFromGame(list: LinkedList<Movable>): void;
}
