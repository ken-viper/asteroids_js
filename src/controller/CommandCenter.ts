import { Falcon } from "../model/Falcon";
import { Movable } from "../model/Movable";
import { Dimension } from "../model/prime/Dimension";
import { LinkedList } from "../model/prime/LinkedList";
import { Universe } from "../model/prime/Universe";
import { Star } from "../model/Star";
import { GameOpAction } from "./GameOp";
import { GameOpsQueue } from "./GameOpsQueue";

export class CommandCenter {
	private universe: Universe = Universe.FREE_FLY;
	private numFalcons: number = 0;
	private level: number = 0;
	private score: number = 0;
	private paused: boolean = false;
	private themeMusic: boolean = false;
	private radar: boolean = false;
	private frame: number = 0;

	private readonly falcon: Falcon = new Falcon();
	private readonly miniDimHash: Map<Universe, Dimension> = new Map<Universe, Dimension>();
	// TODO: Add concrete implementation
	private readonly miniMap: any;

	private readonly movDebris: LinkedList<Movable> = new LinkedList<Movable>();
	private readonly movFriends: LinkedList<Movable> = new LinkedList<Movable>();
	private readonly movFoes: LinkedList<Movable> = new LinkedList<Movable>();
	private readonly movFloaters: LinkedList<Movable> = new LinkedList<Movable>();

	private readonly opsQueue: GameOpsQueue = new GameOpsQueue();

	// Singleton instance
	private static instance: CommandCenter;

	// Singleton private constructor
	private constructor() {}

	// Singleton instance getter
	public static getInstance(): CommandCenter {
		if (!CommandCenter.instance) {
			CommandCenter.instance = new CommandCenter();
		}
		return CommandCenter.instance;
	}

	public initGame(): void {
		this.clearAll();
		this.generateStarField();
		this.setDimHash();
		this.setLevel(0);
		this.setScore(0);
		this.setPaused(false);
		this.setNumFalcons(4);
		this.falcon.decrementFalconNumAndSpawn();

		this.opsQueue.enqueue(this.falcon, GameOpAction.ADD);
		// TODO: Uncomment this after implementing the radar
		// this.opsQueue.enqueue(this.miniMap, GameOpAction.ADD);
	}

	private setDimHash(): void {
		this.miniDimHash.set(Universe.FREE_FLY, new Dimension(1, 1));
		this.miniDimHash.set(Universe.CENTER, new Dimension(1, 1));
		this.miniDimHash.set(Universe.BIG, new Dimension(2, 2));
		this.miniDimHash.set(Universe.HORIZONTAL, new Dimension(3, 1));
		this.miniDimHash.set(Universe.VERTICAL, new Dimension(1, 3));
		this.miniDimHash.set(Universe.DARK, new Dimension(4, 4));
	}

	private generateStarField(): void {
		let count: number = 100;
		while (count-- > 0) {
			this.opsQueue.enqueue(new Star(), GameOpAction.ADD);
		}
	}

	public incrementFrame(): void {
		this.frame++;
	}

	private clearAll(): void {
		this.movDebris.clear();
		this.movFriends.clear();
		this.movFoes.clear();
		this.movFloaters.clear();
	}

	public isGameOver(): boolean {
		return this.numFalcons < 1;
	}

	public getUniDim(): Dimension {
		if (this.universe === undefined) {
			throw new Error("Universe is not set");
		}
		return this.miniDimHash.get(this.universe)!;
	}

	public isFalconPositionFixed(): boolean {
		return this.universe !== Universe.FREE_FLY;
	}

	// Getters and setters
	public getUniverse(): Universe | undefined {
		return this.universe;
	}

	public setUniverse(universe: Universe): void {
		this.universe = universe;
	}

	public getNumFalcons(): number {
		return this.numFalcons;
	}

	public setNumFalcons(numFalcons: number): void {
		this.numFalcons = numFalcons;
	}

	public getLevel(): number {
		return this.level;
	}

	public setLevel(level: number): void {
		this.level = level;
	}

	public getScore(): number {
		return this.score;
	}

	public setScore(score: number): void {
		this.score = score;
	}

	public isPaused(): boolean {
		return this.paused;
	}

	public setPaused(paused: boolean): void {
		this.paused = paused;
	}

	public isThemeMusic(): boolean {
		return this.themeMusic;
	}

	public setThemeMusic(themeMusic: boolean): void {
		this.themeMusic = themeMusic;
	}

	public isRadar(): boolean {
		return this.radar;
	}

	public setRadar(radar: boolean): void {
		this.radar = radar;
	}

	public getFrame(): number {
		return this.frame;
	}

	public setFrame(frame: number): void {
		this.frame = frame;
	}

	public getFalcon(): any {
		return this.falcon;
	}

	public getMovDebris(): LinkedList<Movable> {
		return this.movDebris;
	}

	public getMovFriends(): LinkedList<Movable> {
		return this.movFriends;
	}

	public getMovFoes(): LinkedList<Movable> {
		return this.movFoes;
	}

	public getMovFloaters(): LinkedList<Movable> {
		return this.movFloaters;
	}

	public getOpsQueue(): GameOpsQueue {
		return this.opsQueue;
	}
}
