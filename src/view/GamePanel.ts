import { CommandCenter } from "../controller/CommandCenter";
import { Game } from "../controller/Game";
import { Utils } from "../controller/Utils";
import { Movable } from "../model/Movable";
import { Dimension } from "../model/prime/Dimension";
import { Point } from "../model/prime/Point";
import { PolarPoint } from "../model/prime/PolarPoint";
import { getEnumName, Universe } from "../model/prime/Universe";
import { GameFrame } from "./GameFrame";
import {LinkedList} from "../model/prime/LinkedList";

export class GamePanel {
	private readonly gameFrame: GameFrame;

	private readonly fontNormal = "bold 12px sans-serif";
	private readonly fontBig = "bold italic 36px sans-serif";
	private readonly fontHeight = 12;

	private readonly pntShipsRemaining: Point[] = [];

	// Required for double buffering
	private canvas: HTMLCanvasElement;
	private offscreenCanvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private offscreenContext: CanvasRenderingContext2D;

	constructor(dimensions: Dimension) {
		this.gameFrame = new GameFrame(dimensions);

		this.canvas = this.gameFrame.getCanvas();
		this.context = this.gameFrame.getContext();
		this.offscreenCanvas = document.createElement("canvas");
		this.offscreenCanvas.width = this.canvas.width;
		this.offscreenCanvas.height = this.canvas.height;
		this.offscreenContext = this.offscreenCanvas.getContext("2d")!;

		this.pntShipsRemaining.push(new Point(0, 9));
		this.pntShipsRemaining.push(new Point(-1, 6));
		this.pntShipsRemaining.push(new Point(-1, 3));
		this.pntShipsRemaining.push(new Point(-4, 1));
		this.pntShipsRemaining.push(new Point(4, 1));
		this.pntShipsRemaining.push(new Point(-4, 1));
		this.pntShipsRemaining.push(new Point(-4, -2));
		this.pntShipsRemaining.push(new Point(-1, -2));
		this.pntShipsRemaining.push(new Point(-1, -9));
		this.pntShipsRemaining.push(new Point(-1, -2));
		this.pntShipsRemaining.push(new Point(-4, -2));
		this.pntShipsRemaining.push(new Point(-10, -8));
		this.pntShipsRemaining.push(new Point(-5, -9));
		this.pntShipsRemaining.push(new Point(-7, -11));
		this.pntShipsRemaining.push(new Point(-4, -11));
		this.pntShipsRemaining.push(new Point(-2, -9));
		this.pntShipsRemaining.push(new Point(-2, -10));
		this.pntShipsRemaining.push(new Point(-1, -10));
		this.pntShipsRemaining.push(new Point(-1, -9));
		this.pntShipsRemaining.push(new Point(1, -9));
		this.pntShipsRemaining.push(new Point(1, -10));
		this.pntShipsRemaining.push(new Point(2, -10));
		this.pntShipsRemaining.push(new Point(2, -9));
		this.pntShipsRemaining.push(new Point(4, -11));
		this.pntShipsRemaining.push(new Point(7, -11));
		this.pntShipsRemaining.push(new Point(5, -9));
		this.pntShipsRemaining.push(new Point(10, -8));
		this.pntShipsRemaining.push(new Point(4, -2));
		this.pntShipsRemaining.push(new Point(1, -2));
		this.pntShipsRemaining.push(new Point(1, -9));
		this.pntShipsRemaining.push(new Point(1, -2));
		this.pntShipsRemaining.push(new Point(4, -2));
		this.pntShipsRemaining.push(new Point(4, 1));
		this.pntShipsRemaining.push(new Point(1, 3));
		this.pntShipsRemaining.push(new Point(1, 6));
		this.pntShipsRemaining.push(new Point(0, 9));
	}

	private drawFalconStatus(g: CanvasRenderingContext2D): void {
		g.fillStyle = "white";
		g.font = this.fontNormal;
		const OFFSET_LEFT: number = 220;

		// Draw the level upper-right corner
		const universeName: string = getEnumName(Universe, CommandCenter.getInstance().getUniverse()!)!;
		let levelText: string = `Level: [${CommandCenter.getInstance().getLevel()}] `;
		levelText += `${universeName.replace("_", " ")}`;
		g.fillText(levelText, Game.DIM.getWidth() - OFFSET_LEFT, this.fontHeight);
		g.fillText(
			`Score: ${CommandCenter.getInstance().getScore()}`,
			Game.DIM.getWidth() - OFFSET_LEFT,
			this.fontHeight * 2
		);

		// Status array
		let statusArray: string[] = [];
		if (CommandCenter.getInstance().getFalcon().getShowLevel() > 0) statusArray.push(levelText);
		if (CommandCenter.getInstance().getFalcon().isMaxSpeedAttained()) statusArray.push("WARNING - SLOW DOWN");
		if (CommandCenter.getInstance().getFalcon().getNukeMeter() > 0) statusArray.push("PRESS F for NUKE");
		if (statusArray.length > 0) {
			this.displayTextOnScreen(g, ...statusArray);
		}
	}

	private drawNumFrame(g: CanvasRenderingContext2D): void {
		g.fillStyle = "white";
		g.font = this.fontNormal;
		g.fillText(
			`FRAME[TYPESCRIPT]: ${CommandCenter.getInstance().getFrame()}`,
			12,
			Game.DIM.getHeight() - (this.fontHeight + 22)
		);
	}

	private drawMeters(g: CanvasRenderingContext2D): void {
		const shieldValue: number = CommandCenter.getInstance().getFalcon().getShield() / 2;
		const nukeValue: number = CommandCenter.getInstance().getFalcon().getNukeMeter() / 6;

		this.drawOneMeter(g, "cyan", 1, shieldValue);
		this.drawOneMeter(g, "yellow", 2, nukeValue);
	}

	private drawOneMeter(g: CanvasRenderingContext2D, color: string, offset: number, percent: number): void {
		const xVal: number = Game.DIM.getWidth() - (100 + 120 * offset);
		const yVal: number = Game.DIM.getHeight() - 45;

		g.fillStyle = color;
		g.fillRect(xVal, yVal, percent, 10);

        g.strokeStyle = "gray";
        g.lineWidth = 1;
        g.strokeRect(xVal, yVal, 100, 10);


	}

	public update(): void {
		// Canvas is already created in the constructor
		// We need to first clear the offscreen canvas
		this.offscreenContext.fillStyle = "black";
		this.offscreenContext.fillRect(0, 0, Game.DIM.getWidth(), Game.DIM.getHeight());

		// Development purposes only (might be removed later on)
		this.drawNumFrame(this.offscreenContext);

		if (CommandCenter.getInstance().isGameOver()) {
			this.displayTextOnScreen(
				this.offscreenContext,
				"GAME OVER",
				"use the arrow keys to turn and thrust",
				"use the space bar to fire",
				"'S' to start",
				"'P' to pause",
				"'Q' to quit",
				"'M' to toggle music",
				"'A' to toggle radar"
			);
		} else if (CommandCenter.getInstance().isPaused()) {
			this.displayTextOnScreen(this.offscreenContext, "GAME PAUSED", "press 'P' to continue");
		} else {
            this.moveDrawMovables(
				this.offscreenContext,
				CommandCenter.getInstance().getMovDebris(),
				CommandCenter.getInstance().getMovFloaters(),
				CommandCenter.getInstance().getMovFoes(),
				CommandCenter.getInstance().getMovFriends()
			);
			this.drawNumberShipsRemaining(this.offscreenContext);
			this.drawMeters(this.offscreenContext);
			this.drawFalconStatus(this.offscreenContext);
		}

		// Copy the offscreen canvas to the visible canvas
		this.context.drawImage(this.offscreenCanvas, 0, 0);
	}

	private moveDrawMovables(g: CanvasRenderingContext2D, ...teams: LinkedList<Movable>[]): void {
		teams.forEach((team) => {
            team.forEach((movable) => {
				movable.move();
				movable.draw(g);
			});
		});
	}

	private drawNumberShipsRemaining(g: CanvasRenderingContext2D): void {
		let numFalcons: number = CommandCenter.getInstance().getNumFalcons();
		while (numFalcons > 1) {
			this.drawOneShip(g, numFalcons--);
		}
	}

	private drawOneShip(g: CanvasRenderingContext2D, offset: number): void {
		g.strokeStyle = "orange";

		const SHIP_RADIUS = 15;
		const X_POS = Game.DIM.getWidth() - 27 * offset;
		const Y_POS = Game.DIM.getHeight() - 45;

		const polars = Utils.cartesiansToPolars(this.pntShipsRemaining);

		const rotatePolarBy90 = (pp: PolarPoint): PolarPoint => new PolarPoint(pp.getR(), pp.getTheta() + Math.PI / 2);

		const polarToCartesian = (pp: PolarPoint): Point =>
			new Point(
				Math.round(pp.getR() * SHIP_RADIUS * Math.sin(pp.getTheta())),
				Math.round(pp.getR() * SHIP_RADIUS * Math.cos(pp.getTheta()))
			);

		const adjustForLocation = (pnt: Point): Point => new Point(pnt.getX() + X_POS, pnt.getY() + Y_POS);


        const xPoints = polars
            .map(rotatePolarBy90)
            .map(polarToCartesian)
            .map(adjustForLocation)
            .map((p) => p.getX());

        const yPoints = polars
            .map(rotatePolarBy90)
            .map(polarToCartesian)
            .map(adjustForLocation)
            .map((p) => p.getY());

        Utils.drawPolygon(g, xPoints, yPoints);
	}

	private displayTextOnScreen(g: CanvasRenderingContext2D, ...lines: string[]): void {
		const spacer = 20;
		g.font = this.fontNormal;
		g.fillStyle = "white";
		lines.forEach((line, index) => {
			const textWidth = g.measureText(line).width;
			const x = (g.canvas.width - textWidth) / 2;
			const y = g.canvas.height / 4 + index * spacer;

			g.fillText(line, x, y);
		});
	}
}
