import { GameFrame } from "./GameFrame";

export class GamePanel {
	private readonly gameFrame: GameFrame;

	constructor(dimensions: { width: number; height: number }) {
		this.gameFrame = new GameFrame(dimensions);
	}

	public update(): void {
		console.log("GamePanel update");
	}
}
