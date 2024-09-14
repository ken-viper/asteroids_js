import { Point } from "../model/prime/Point";
import { PolarPoint } from "../model/prime/PolarPoint";

export class Utils {
	public static cartesiansToPolars(pntCartesians: Point[]): PolarPoint[] {
		const hypotenuseOfPoint = (pnt: Point): number => Math.sqrt(pnt.getX() ** 2 + pnt.getY() ** 2);
		const LARGEST_HYP = Math.max(...pntCartesians.map(hypotenuseOfPoint));
		const cartToPolarTransform = (pnt: Point, largestHyp: number): PolarPoint =>
			new PolarPoint(
				hypotenuseOfPoint(pnt) / largestHyp, // r
				Math.atan2(pnt.getY(), pnt.getX()) // theta in radians
			);

		return pntCartesians.map((pnt) => cartToPolarTransform(pnt, LARGEST_HYP));
	}
}
