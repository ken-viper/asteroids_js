import { Point } from "./prime/Point";
import { LinkedList } from "./prime/LinkedList";

export enum Team {
	FRIEND,
	FOE,
	FLOATER,
	DEBRIS,
}

export interface Movable {
	move(): void;
	draw(g: CanvasRenderingContext2D): void;

	getCenter(): Point;
	getRadius(): number;
	getTeam(): Team;

	addToGame(list: LinkedList<Movable>): void;
	removeFromGame(list: LinkedList<Movable>): void;
}
