import { Game } from "../controller/Game";
import { Movable } from "../model/Movable";
import { Point } from "../model/prime/Point";
import { GameFrame } from "./GameFrame";

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

	constructor(dimensions: { width: number; height: number }) {
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

	private drawFalconStatus(g: CanvasRenderingContext2D): void {}
	private drawNumFrame(g: CanvasRenderingContext2D): void {}
	private drawMeters(g: CanvasRenderingContext2D): void {}
	private drawOneMeter(g: CanvasRenderingContext2D, color: string, offset: number, percent: number): void {}

	public update(): void {
		// Canvas is already created in the constructor
		// We need to first clear the offscreen canvas
		this.offscreenContext.fillStyle = "black";
		this.offscreenContext.fillRect(0, 0, Game.DIM.width, Game.DIM.height);

		// Developed purposes only (might be removed later on)
		this.drawNumFrame(this.offscreenContext);

		if (true) {
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
		} else if (false) {
			this.displayTextOnScreen(this.offscreenContext, "GAME PAUSED", "press 'P' to continue");
		} else {
			this.moveDrawMovables(
				this.offscreenContext
				// debris,
				// floaters,
				// foes,
				// friends
			);
			this.drawNumberShipsRemaining(this.offscreenContext);
			this.drawMeters(this.offscreenContext);
			this.drawFalconStatus(this.offscreenContext);
		}

		// Copy the offscreen canvas to the visible canvas
		this.context.drawImage(this.offscreenCanvas, 0, 0);
	}

	private moveDrawMovables(g: CanvasRenderingContext2D, ...teams: Movable[][]): void {
		teams.forEach((team) => {
			team.forEach((movable) => {
				movable.move();
				movable.draw(g);
			});
		});
	}

	private drawNumberShipsRemaining(g: CanvasRenderingContext2D): void {}
	private drawOneShip(g: CanvasRenderingContext2D, offset: number): void {}

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
