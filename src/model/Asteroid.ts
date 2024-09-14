import { CommandCenter } from "../controller/CommandCenter";
import { GameOpAction } from "../controller/GameOp";
import { SoundLoader } from "../controller/SoundLoader";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { Point } from "./prime/Point";
import { PolarPoint } from "./prime/PolarPoint";
import { Sprite } from "./Sprite";
import { WhiteCloudDebris } from "./WhiteCloudDebris";

export class Asteroid extends Sprite {
	private readonly LARGE_RADIUS = 110;

	// Overloading in Typescript is possible by checking the type of the argument
	// Multiple constructors are not allowed
	constructor(size: number);
	constructor(arg: number | Asteroid);
	constructor(arg: number | Asteroid) {
		super();
		if (typeof arg === "number") {
			// Handle asteroid creation from size
			this.initializeFromSize(arg);
		} else {
			// Handle asteroid creation from existing asteroid
			this.initializeFromAsteroid(arg);
		}
	}

	private initializeFromSize(size: number): void {
		if (size === 0) {
			this.setRadius(this.LARGE_RADIUS);
		} else {
			this.setRadius(this.LARGE_RADIUS / (size * 2));
		}

		this.setTeam(Team.FOE);
		this.setColor("white");

		this.setSpin(this.somePosNegValue(10));
		this.setDeltaX(this.somePosNegValue(10));
		this.setDeltaY(this.somePosNegValue(10));
		this.setCartesians(this.generateVertices());
	}

	private initializeFromAsteroid(astExploded: Asteroid): void {
		const newSize = astExploded.getSize() + 1;
		this.initializeFromSize(newSize);

		this.setCenter(new Point(astExploded.getCenter().getX(), astExploded.getCenter().getY()));
		this.setDeltaX(astExploded.getDeltaX() / 1.5 + this.somePosNegValue(5 + newSize * 2));
		this.setDeltaY(astExploded.getDeltaY() / 1.5 + this.somePosNegValue(5 + newSize * 2));
	}

	public getSize(): number {
		switch (this.getRadius()) {
			case this.LARGE_RADIUS:
				return 0;
			case this.LARGE_RADIUS / 2:
				return 1;
			case this.LARGE_RADIUS / 4:
				return 2;
			default:
				return 0;
		}
	}

	private generateVertices(): Point[] {
		const MAX_RADIANS_X1000 = 6283;
		const PRECISION = 1000;

		const polarPointSupplier = (): PolarPoint => {
			const r = (800 + Math.floor(Math.random() * 200)) / PRECISION; // Radius between 0.8 and 0.999
			const theta = Math.floor(Math.random() * MAX_RADIANS_X1000) / PRECISION; // Angle between 0 and 6.283 (2π)
			return new PolarPoint(r, theta);
		};

		const polarToCartesian = (pp: PolarPoint): Point => {
			const x = Math.sin(pp.getTheta()) * pp.getR() * PRECISION;
			const y = Math.cos(pp.getTheta()) * pp.getR() * PRECISION;
			return new Point(Math.round(x), Math.round(y));
		};

		const VERTICES = Math.floor(Math.random() * 7) + 25;

		const points = Array.from({ length: VERTICES })
			.map(() => polarPointSupplier())
			.sort((pp1, pp2) => pp1.compareTheta(pp2))
			.map(polarToCartesian);
		return points;
	}

	public draw(g: CanvasRenderingContext2D): void {
		this.renderVector(g);
	}

	public removeFromGame(list: LinkedList<Movable>): void {
		super.removeFromGame(list);
		this.spawnSmallerAsteroidsOrDebris();
		CommandCenter.getInstance().setScore(CommandCenter.getInstance().getScore() + 10 * (this.getSize() + 1));

		if (this.getSize() > 1) {
			SoundLoader.playSound("pillow.wav");
		} else {
			SoundLoader.playSound("kapow.wav");
		}
	}

	private spawnSmallerAsteroidsOrDebris(): void {
		let size: number = this.getSize();

		if (size > 1) {
			CommandCenter.getInstance().getOpsQueue().enqueue(new WhiteCloudDebris(this), GameOpAction.ADD);
		} else {
			size += 2;
			while (size-- > 0) {
				CommandCenter.getInstance().getOpsQueue().enqueue(new Asteroid(this), GameOpAction.ADD);
			}
		}
	}
}
