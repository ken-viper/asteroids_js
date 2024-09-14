import { CommandCenter } from "../controller/CommandCenter";
import { Game } from "../controller/Game";
import { Asteroid } from "./Asteroid";
import { Falcon } from "./Falcon";
import { Team } from "./Movable";
import { Nuke } from "./Nuke";
import { NukeFloater } from "./NukeFloater";
import { AspectRatio } from "./prime/AspectRatio";
import { Dimension } from "./prime/Dimension";
import { Point } from "./prime/Point";
import { Sprite } from "./Sprite";

export class MiniMap extends Sprite {
	private readonly MINI_MAP_PERCENT: number = 0.31;
	private aspectRatio: AspectRatio = new AspectRatio(1, 1);

	private readonly PUMPKIN_COLOR: string = "rgb(200, 100, 50)";
	private readonly LIGHT_GRAY_COLOR: string = "rgb(200, 200, 200)";

	constructor() {
		super();
		this.setTeam(Team.DEBRIS);
		this.setCenter(new Point(0, 0));
	}

	public move(): void {
		// Minimap is fixed
	}

	public draw(g: CanvasRenderingContext2D): void {
		if (CommandCenter.getInstance().isRadar()) return;

		this.aspectRatio = this.aspectAdjustedRatio(CommandCenter.getInstance().getUniDim());

		const miniWidth = Math.round(this.MINI_MAP_PERCENT * Game.DIM.getWidth() * this.aspectRatio.getWidth());
		const miniHeight = Math.round(this.MINI_MAP_PERCENT * Game.DIM.getHeight() * this.aspectRatio.getHeight());

		// Gray bounding box (entire universe)
		g.strokeStyle = "rgb(64, 64, 64)";
		g.strokeRect(0, 0, miniWidth, miniHeight);

		// View-portal box
		g.strokeStyle = "rgb(64, 64, 64)";
		const miniViewPortWidth = miniWidth / CommandCenter.getInstance().getUniDim().getWidth();
		const miniViewPortHeight = miniHeight / CommandCenter.getInstance().getUniDim().getHeight();
		g.strokeRect(0, 0, miniViewPortWidth, miniViewPortHeight);

		// Draw debris
		CommandCenter.getInstance()
			.getMovDebris()
			.forEach((mov) => {
				g.fillStyle = "darkgray";
				const translatedPoint: Point = this.translatePoint(mov.getCenter());
				g.beginPath();
				g.arc(translatedPoint.getX() - 1, translatedPoint.getY() - 1, 2, 0, 2 * Math.PI);
				g.fill();
			});

		// Draw asteroids
		CommandCenter.getInstance()
			.getMovFoes()
			.forEach((mov) => {
				if (!(mov instanceof Asteroid)) return;

				const asteroid: Asteroid = mov;
				g.fillStyle = this.LIGHT_GRAY_COLOR;
				g.strokeStyle = this.LIGHT_GRAY_COLOR;
				const translatedPoint: Point = this.translatePoint(asteroid.getCenter());

				switch (asteroid.getSize()) {
					case 0:
						g.beginPath();
						g.arc(translatedPoint.getX() - 3, translatedPoint.getY() - 3, 6, 0, 2 * Math.PI);
						g.fill();
					case 1:
						g.beginPath();
						g.arc(translatedPoint.getX() - 3, translatedPoint.getY() - 3, 6, 0, 2 * Math.PI);
						g.stroke();
					case 2:
					default:
						g.beginPath();
						g.arc(translatedPoint.getX() - 2, translatedPoint.getY() - 2, 4, 0, 2 * Math.PI);
						g.stroke();
				}
			});

		// Draw floaters
		CommandCenter.getInstance()
			.getMovFloaters()
			.forEach((mov) => {
				g.fillStyle = mov instanceof NukeFloater ? "yellow" : "cyan";
				const translatedPoint: Point = this.translatePoint(mov.getCenter());
				g.beginPath();
				g.arc(translatedPoint.getX() - 2, translatedPoint.getY() - 2, 4, 0, 2 * Math.PI);
			});

		// Draw friends
		CommandCenter.getInstance()
			.getMovFriends()
			.forEach((mov) => {
				let color: string;
				if (mov instanceof Falcon && CommandCenter.getInstance().getFalcon().getShield() > 0) {
					color = "cyan";
				} else if (mov instanceof Nuke) {
					color = "yellow";
				} else {
					color = this.PUMPKIN_COLOR;
				}
				g.fillStyle = color;
				const translatedPoint: Point = this.translatePoint(mov.getCenter());
				g.beginPath();
				g.arc(translatedPoint.getX() - 2, translatedPoint.getY() - 2, 4, 0, 2 * Math.PI);
				g.fill();
			});
	}

	private translatePoint(point: Point) {
		return new Point(
			Math.round(
				((this.MINI_MAP_PERCENT * point.getX()) / CommandCenter.getInstance().getUniDim().getWidth()) *
					this.aspectRatio.getWidth()
			),
			Math.round(
				((this.MINI_MAP_PERCENT * point.getY()) / CommandCenter.getInstance().getUniDim().getHeight()) *
					this.aspectRatio.getHeight()
			)
		);
	}

	private aspectAdjustedRatio(universeDim: Dimension): AspectRatio {
		if (universeDim.getWidth() === universeDim.getHeight()) {
			return new AspectRatio(1, 1);
		} else if (universeDim.getWidth() > universeDim.getHeight()) {
			const wMultiple: number = universeDim.getWidth() / universeDim.getHeight();
			return new AspectRatio(wMultiple, 1).scale(0.5);
		} else {
			const hMultiple: number = universeDim.getHeight() / universeDim.getWidth();
			return new AspectRatio(1, hMultiple).scale(0.5);
		}
	}
}
