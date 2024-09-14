import { CommandCenter } from "../controller/CommandCenter";
import { Game } from "../controller/Game";
import { GameOpAction } from "../controller/GameOp";
import { Utils } from "../controller/Utils";
import { Movable, Team } from "./Movable";
import { LinkedList } from "./prime/LinkedList";
import { Point } from "./prime/Point";
import { PolarPoint } from "./prime/PolarPoint";

export abstract class Sprite implements Movable {
	private center: Point;
	private deltaX: number = 0;
	private deltaY: number = 0;
	private team: Team = Team.FRIEND; // Default value provided to avoid null pointer exceptions, should be overridden
	private radius: number = 0;
	private orientation: number = 0;
	private expiry: number = 0;
	private spin: number = 0;
	private cartesians: Point[] = [];
	private color: string = "white"; // Default value provided to avoid null pointer exceptions, should be overridden
	private rasterMap: Map<any, HTMLImageElement | null | undefined> = new Map<
		any,
		HTMLImageElement | null | undefined
	>();

	constructor() {
		// Places the sprite somewhere random on the screen
		// Math.floor rounds down to the nearest integer
		// Math.random generates a random number between 0 and 1
		this.center = new Point(
			Math.floor(Math.random() * Game.DIM.getWidth()),
			Math.floor(Math.random() * Game.DIM.getHeight())
		);
	}

	// Abstract method would require the subclass to implement its own draw method
	abstract draw(g: CanvasRenderingContext2D): void;

	public move(): void {
		// Keeps the sprite inside the bounds of the game
		const scalarX = CommandCenter.getInstance().getUniDim().getWidth();
		const scalarY = CommandCenter.getInstance().getUniDim().getHeight();

		if (this.center.getX() > scalarX * Game.DIM.getWidth()) {
			this.center.setX(1);
		} else if (this.center.getX() < 0) {
			this.center.setX(scalarX * Game.DIM.getWidth() - 1);
		} else if (this.center.getY() > scalarY * Game.DIM.getHeight()) {
			this.center.setY(1);
		} else if (this.center.getY() < 0) {
			this.center.setY(scalarY * Game.DIM.getHeight() - 1);
		} else {
			let newXPos: number = this.center.getX();
			let newYPos: number = this.center.getY();

			if (CommandCenter.getInstance().isFalconPositionFixed()) {
				newXPos -= CommandCenter.getInstance().getFalcon().getDeltaX();
				newYPos -= CommandCenter.getInstance().getFalcon().getDeltaY();
			}
			this.center.setX(Math.floor(newXPos + this.deltaX));
			this.center.setY(Math.floor(newYPos + this.deltaY));
		}

		if (this.expiry > 0) {
			this.expire();
		}

		if (this.spin !== 0) {
			this.orientation += this.spin;
		}
	}

	private expire(): void {
		if (this.expiry === 1) {
			CommandCenter.getInstance().getOpsQueue().enqueue(this, GameOpAction.REMOVE);
		}
		this.expiry--;
	}

	protected somePosNegValue(seed: number): number {
		const randomNumber = Math.floor(Math.random() * seed);
		return randomNumber % 2 === 0 ? randomNumber : -randomNumber;
	}

	protected renderRaster(g: CanvasRenderingContext2D, image: HTMLImageElement | null | undefined): void {
		if (image === null || image === undefined) return;

		const centerX = this.getCenter().getX();
		const centerY = this.getCenter().getY();
		const width = this.getRadius() * 2;
		const height = this.getRadius() * 2;
		const angleRadians = (Math.PI / 180) * this.getOrientation();

		g.save();
		g.translate(centerX, centerY);
		g.scale(width / (image.width as number), height / (image.height as number));
		g.rotate(angleRadians);
		g.drawImage(image, -((image.width as number) / 2), -((image.height as number) / 2));
		g.restore();
	}

	// TODO: Fix the rendering issue of polygons
	protected renderVector(g: CanvasRenderingContext2D): void {
		if (this.color) {
			g.strokeStyle = this.color;
		}

		const polars = Utils.cartesiansToPolars(this.cartesians);

		const rotatePolarByOrientation = (pp: PolarPoint): PolarPoint =>
			new PolarPoint(pp.getR(), pp.getTheta() + (Math.PI / 180) * this.orientation);

		const polarToCartesian = (pp: PolarPoint): Point =>
			new Point(
				pp.getR() * this.radius * Math.sin(pp.getTheta()),
				pp.getR() * this.radius * Math.cos(pp.getTheta())
			);

		const adjustForLocation = (p: Point): Point =>
			new Point(this.getCenter().getX() + p.getX(), this.getCenter().getY() - p.getY());

		const xPoints = polars
			.map(rotatePolarByOrientation)
			.map(polarToCartesian)
			.map(adjustForLocation)
			.map((p) => p.getX());

		const yPoints = polars
			.map(rotatePolarByOrientation)
			.map(polarToCartesian)
			.map(adjustForLocation)
			.map((p) => p.getY());

		g.beginPath();
		g.moveTo(xPoints[0], yPoints[0]);
		for (let i = 0; i < xPoints.length; i++) {
			g.lineTo(xPoints[i], yPoints[i]);
		}
		g.lineTo(xPoints[0], yPoints[0]);
		g.closePath();
		g.stroke();
	}

	public addToGame(list: LinkedList<Movable>): void {
		list.add(this);
	}

	public removeFromGame(list: LinkedList<Movable>): void {
		list.remove(this);
	}

	getCenter(): Point {
		return this.center;
	}

	getDeltaX(): number {
		return this.deltaX;
	}

	getDeltaY(): number {
		return this.deltaY;
	}

	getRadius(): number {
		return this.radius;
	}

	getOrientation(): number {
		return this.orientation;
	}

	getTeam(): Team {
		return this.team;
	}

	setCenter(center: Point): void {
		this.center = center;
	}

	setDeltaX(deltaX: number): void {
		this.deltaX = deltaX;
	}

	setDeltaY(deltaY: number): void {
		this.deltaY = deltaY;
	}

	setRadius(radius: number): void {
		this.radius = radius;
	}

	setOrientation(orientation: number): void {
		this.orientation = orientation;
	}

	setTeam(team: Team): void {
		this.team = team;
	}

	setExpiry(expiry: number): void {
		this.expiry = expiry;
	}

	setSpin(spin: number): void {
		this.spin = spin;
	}

	setCartesians(cartesians: Point[]): void {
		this.cartesians = cartesians;
	}

	setColor(color: string): void {
		this.color = color;
	}

	setRasterMap(rasterMap: Map<any, HTMLImageElement | null | undefined>): void {
		this.rasterMap = rasterMap;
	}

	getRasterMap(): Map<any, HTMLImageElement | null | undefined> {
		return this.rasterMap;
	}
}
