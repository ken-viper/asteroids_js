import { GamePanel } from "../view/GamePanel";

export class Game {
	public static readonly DIM = { width: 1500, height: 950 };

	private readonly gamePanel: GamePanel;
	public static readonly ANIMATION_DELAY = 40;
	public static readonly FRAMES_PER_SECOND = 1000 / Game.ANIMATION_DELAY;

	// Last frame rendered timestamp (used in the game loop)
	private lastFrameTime: number = 0;

	constructor() {
		this.gamePanel = new GamePanel(Game.DIM);
	}

	public init(): void {
		this.lastFrameTime = performance.now();
		this.run();
	}

	public run(): void {
		const update = (currentTime: number) => {
			const deltaTime = currentTime - this.lastFrameTime;

			if (deltaTime >= Game.ANIMATION_DELAY) {
				this.gamePanel.update();

				this.checkCollisions();
				this.checkNewLevel();
				this.checkFloaters();
				this.processGameOpsQueue();

				this.lastFrameTime = currentTime;
			}

			// Request the next frame
			requestAnimationFrame(update);
		};

		// Starts the animation loop
		requestAnimationFrame(update);
	}

	checkFloaters() {}
	checkCollisions() {}
	processGameOpsQueue() {}
	spawnShieldFloater() {}
	spawnNukeFloater() {}
	spawnBigAsteroids(num: number) {}
	isLevelClear() {}
	checkNewLevel() {}

	keyPressed(event: KeyboardEvent) {}
	keyReleased(event: KeyboardEvent) {}
}
