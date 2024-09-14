import { Movable, Team } from "../model/Movable";
import { Dimension } from "../model/prime/Dimension";
import { LinkedList } from "../model/prime/LinkedList";
import { Point } from "../model/prime/Point";
import { getEnumValues, Universe } from "../model/prime/Universe";
import { GamePanel } from "../view/GamePanel";
import { CommandCenter } from "./CommandCenter";
import { GameOp, GameOpAction } from "./GameOp";
import { Bullet } from "../model/Bullet";
import { Falcon, FalconTurnState } from "../model/Falcon";
import { Asteroid } from "../model/Asteroid";
import { ShieldFloater } from "../model/ShieldFloater";
import { NukeFloater } from "../model/NukeFloater";

export class Game {
	public static readonly DIM: Dimension = new Dimension(1400, 680);

	private readonly gamePanel: GamePanel;
	public static readonly ANIMATION_DELAY = 40;
	public static readonly FRAMES_PER_SECOND = 1000 / Game.ANIMATION_DELAY;

	// Last frame rendered timestamp (used in the game loop)
	private lastFrameTime: number = 0;

	// Key codes
	private static readonly KEYS = {
		PAUSE: 80, // p key
		QUIT: 81, // q key
		LEFT: 37, // left arrow
		RIGHT: 39, // right arrow
		UP: 38, // up arrow
		DOWN: 40, // down arrow
		START: 83, // s key
		FIRE: 32, // space bar
		MUTE: 77, // m key
		NUKE: 70, // f key
		RADAR: 65, // a key
	};

	constructor() {
		this.gamePanel = new GamePanel(Game.DIM);

		window.addEventListener("keydown", (event) => this.keyPressed(event));
		window.addEventListener("keyup", (event) => this.keyReleased(event));
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
				CommandCenter.getInstance().incrementFrame();

				this.lastFrameTime = currentTime;
			}

			// Request the next frame
			requestAnimationFrame(update);
		};

		// Starts the animation loop
		requestAnimationFrame(update);
	}

	private checkFloaters(): void {
		this.spawnShieldFloater();
		this.spawnNukeFloater();
	}

	private checkCollisions(): void {
		let pntFriendCenter: Point;
		let pntFoeCenter: Point;
		let radFriend: number;
		let radFoe: number;

		// Check for collisions between friends and foes
		CommandCenter.getInstance()
			.getMovFriends()
			.forEach((movFriend: Movable) => {
				CommandCenter.getInstance()
					.getMovFoes()
					.forEach((movFoe: Movable) => {
						pntFriendCenter = movFriend.getCenter();
						pntFoeCenter = movFoe.getCenter();
						radFriend = movFriend.getRadius();
						radFoe = movFoe.getRadius();
						// Detect collision
						if (pntFriendCenter.distanceTo(pntFoeCenter) < radFriend + radFoe) {
							CommandCenter.getInstance().getOpsQueue().enqueue(movFriend, GameOpAction.REMOVE);
							CommandCenter.getInstance().getOpsQueue().enqueue(movFoe, GameOpAction.REMOVE);
						}
					});
			});

		// Check for collisions between the falcon and floaters
		let pntFalconCenter: Point = CommandCenter.getInstance().getFalcon().getCenter();
		let radFalcon: number = CommandCenter.getInstance().getFalcon().getRadius();
		let pntFloaterCenter: Point;
		let radFloater: number;
		CommandCenter.getInstance()
			.getMovFloaters()
			.forEach((movFloater: Movable) => {
				pntFloaterCenter = movFloater.getCenter();
				radFloater = movFloater.getRadius();
				// Detect collision
				if (pntFalconCenter.distanceTo(pntFloaterCenter) < radFalcon + radFloater) {
					CommandCenter.getInstance().getOpsQueue().enqueue(movFloater, GameOpAction.REMOVE);
				}
			});
	}

	private processGameOpsQueue(): void {
		while (!CommandCenter.getInstance().getOpsQueue().isEmpty()) {
			const gameOp: GameOp = CommandCenter.getInstance().getOpsQueue().dequeue()!;

			if (gameOp) {
				let list: LinkedList<Movable>;
				const mov: Movable = gameOp.getMovable();

				switch (mov.getTeam()) {
					case Team.FOE:
						list = CommandCenter.getInstance().getMovFoes();
						break;
					case Team.FRIEND:
						list = CommandCenter.getInstance().getMovFriends();
						break;
					case Team.FLOATER:
						list = CommandCenter.getInstance().getMovFloaters();
						break;
					case Team.DEBRIS:
					default:
						list = CommandCenter.getInstance().getMovDebris();
						break;
				}

				const action: GameOpAction = gameOp.getAction();
				if (action === GameOpAction.ADD) {
					mov.addToGame(list);
				} else {
					mov.removeFromGame(list);
				}
			}
		}
	}

	private spawnShieldFloater(): void {
		if (CommandCenter.getInstance().getFrame() % ShieldFloater.SPAWN_SHIELD_FLOATER === 0) {
			CommandCenter.getInstance()
				.getOpsQueue()
				.enqueue(new ShieldFloater(Game.FRAMES_PER_SECOND), GameOpAction.ADD);
		}
	}

	private spawnNukeFloater(): void {
		if (CommandCenter.getInstance().getFrame() % NukeFloater.SPAWN_NUKE_FLOATER === 0) {
			CommandCenter.getInstance()
				.getOpsQueue()
				.enqueue(new NukeFloater(Game.FRAMES_PER_SECOND), GameOpAction.ADD);
		}
	}

	private spawnBigAsteroids(num: number): void {
		while (num-- > 0) {
			CommandCenter.getInstance().getOpsQueue().enqueue(new Asteroid(0), GameOpAction.ADD);
		}
	}

	private isLevelClear(): boolean {
		let asteroidFree: boolean = true;
		CommandCenter.getInstance()
			.getMovFoes()
			.forEach((movFoe: Movable) => {
				if (movFoe instanceof Asteroid) {
					asteroidFree = false;
				}
			});
		return asteroidFree;
	}

	private checkNewLevel(): void {
		if (!this.isLevelClear()) {
			return;
		}

		// Award points for clearing the level
		let level: number = CommandCenter.getInstance().getLevel();
		CommandCenter.getInstance().setScore(CommandCenter.getInstance().getScore() + 10000 * level);

		// Center the falcon
		CommandCenter.getInstance()
			.getFalcon()
			.setCenter(new Point(Game.DIM.getWidth() / 2, Game.DIM.getHeight() / 2));

		// Cycle through universes
		const universeValues: number[] = getEnumValues(Universe);
		const ordinal: number = level % universeValues.length;
		CommandCenter.getInstance().setUniverse(universeValues[ordinal]);
		// Toggle radar on by default in bigger universes
		// (players still have the option to turn it off)
		CommandCenter.getInstance().setRadar(ordinal > 1);

		// Level up
		level += 1;
		CommandCenter.getInstance().setLevel(level);
		this.spawnBigAsteroids(level);

		// Make the falcon invincible in case new asteroids spawn on top of it
		CommandCenter.getInstance().getFalcon().setShield(Falcon.INITIAL_SPAWN_TIME);
		// Show level and universe in the center of the screen
		CommandCenter.getInstance().getFalcon().setShowLevel(Falcon.INITIAL_SPAWN_TIME);
	}

	keyPressed(event: KeyboardEvent): void {
		const falcon: Falcon = CommandCenter.getInstance().getFalcon();

		switch (event.keyCode) {
			case Game.KEYS.FIRE:
				CommandCenter.getInstance().getOpsQueue().enqueue(new Bullet(falcon), GameOpAction.ADD);
				break;
			case Game.KEYS.NUKE:
				break;
			case Game.KEYS.UP:
				falcon.setThrusting(true);
				// TODO: Play sound effect ("whitenoise-loop.wav")
				break;
			case Game.KEYS.LEFT:
				falcon.setTurnState(FalconTurnState.LEFT);
				break;
			case Game.KEYS.RIGHT:
				falcon.setTurnState(FalconTurnState.RIGHT);
				break;
			default:
				break;
		}
	}

	keyReleased(event: KeyboardEvent): void {
		const falcon: Falcon = CommandCenter.getInstance().getFalcon();

		if (event.keyCode === Game.KEYS.START && CommandCenter.getInstance().isGameOver()) {
			CommandCenter.getInstance().initGame();
			return;
		}

		switch (event.keyCode) {
			case Game.KEYS.LEFT:
			case Game.KEYS.RIGHT:
				falcon.setTurnState(FalconTurnState.IDLE);
				break;
			case Game.KEYS.UP:
				falcon.setThrusting(false);
				// TODO: Stop sound effect ("whitenoise-loop.wav")
				break;
			case Game.KEYS.PAUSE:
				CommandCenter.getInstance().setPaused(!CommandCenter.getInstance().isPaused());
				break;
			case Game.KEYS.QUIT:
				// When quitting, the game is over since we cannot close the browser
				CommandCenter.getInstance().setNumFalcons(0);
				break;
			case Game.KEYS.RADAR:
				CommandCenter.getInstance().setRadar(!CommandCenter.getInstance().isRadar());
				break;
			case Game.KEYS.MUTE:
				// TODO: Add music
				CommandCenter.getInstance().setThemeMusic(!CommandCenter.getInstance().isThemeMusic());
				break;
			default:
				break;
		}
	}
}
