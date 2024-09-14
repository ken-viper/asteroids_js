import { ImageLoader } from "../controller/ImageLoader";
import { Team } from "./Movable";
import { Point } from "./prime/Point";
import { Sprite } from "./Sprite";

export class WhiteCloudDebris extends Sprite {
	public static readonly SLOW_MO: number = 3;
	private index: number = 0;

	constructor(explodingSprite: Sprite) {
		super();
		this.setTeam(Team.DEBRIS);

		const rasterMap = new Map<number, HTMLImageElement | null | undefined>();
		rasterMap.set(0, ImageLoader.getImage("exp/row-1-column-1.png"));
		rasterMap.set(1, ImageLoader.getImage("exp/row-1-column-2.png"));
		rasterMap.set(2, ImageLoader.getImage("exp/row-1-column-3.png"));
		rasterMap.set(3, ImageLoader.getImage("exp/row-2-column-1.png"));
		rasterMap.set(4, ImageLoader.getImage("exp/row-2-column-2.png"));
		rasterMap.set(5, ImageLoader.getImage("exp/row-2-column-3.png"));
		rasterMap.set(6, ImageLoader.getImage("exp/row-3-column-1.png"));
		rasterMap.set(7, ImageLoader.getImage("exp/row-3-column-2.png"));
		rasterMap.set(8, ImageLoader.getImage("exp/row-3-column-3.png"));
		this.setRasterMap(rasterMap);

		this.setExpiry(rasterMap.size * WhiteCloudDebris.SLOW_MO);

		this.setSpin(explodingSprite.getSpin());
		this.setCenter(explodingSprite.getCenter().clone());
		this.setDeltaX(explodingSprite.getDeltaX());
		this.setDeltaY(explodingSprite.getDeltaY());
		this.setRadius(Math.floor(explodingSprite.getRadius() * 1.32));
	}

	draw(g: CanvasRenderingContext2D): void {
		this.renderRaster(g, this.getRasterMap().get(this.index));
		if (this.getExpiry() % WhiteCloudDebris.SLOW_MO === 0) {
			this.index++;
		}
	}
}
