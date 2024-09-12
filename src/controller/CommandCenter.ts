import { GameOpsQueue } from "./GameOpsQueue";

export enum Universe {
	FREE_FLY,
	CENTER,
	BIG,
	HORIZONTAL,
	VERTICAL,
	DARK,
}

export class CommandCenter {
	private universe: Universe;
	private numFalcons: number;
	private level: number;
	private score: number;
	private paused: boolean;
	private themeMusic: boolean;
	private radar: boolean;
	private frame: number;

	private readonly falcon: any;
	private readonly miniDimHash: Map<Universe, any>;
	private readonly miniMap: any;

	private readonly movDebris: LinkedList<any>;
	private readonly movFriends: LinkedList<any>;
	private readonly movFoes: LinkedList<any>;
	private readonly movFloaters: LinkedList<any>;

	private readonly opsQueue: GameOpsQueue;

	// Singleton instance
	private static instance: CommandCenter;

	private constructor() {}

	public static getInstance(): CommandCenter {
		if (!CommandCenter.instance) {
			CommandCenter.instance = new CommandCenter();
		}
		return CommandCenter.instance;
	}

	public initGame(): void {}

	private setDimHash(): void {}
	private generateStarField(): void {}
	private incrementFrame(): void {}
	private clearAll(): void {}

	public isGameOver(): boolean {
		return this.numFalcons < 1;
	}
	public getUniDim(): any {}

	public isFalconPositionFixed(): boolean {
		return this.universe !== Universe.FREE_FLY;
	}
}
