import { Point } from "../model/prime/Point";
import { PolarPoint } from "../model/prime/PolarPoint";

export class Utils {
	public static cartesiansToPolars(pntCartesians: Point[]): PolarPoint[] {
		const hypotenuseOfPoint = (pnt: Point): number => Math.sqrt(Math.pow(pnt.getX(), 2) + Math.pow(pnt.getY(), 2));
		const LARGEST_HYP = pntCartesians.map(hypotenuseOfPoint).reduce((max, current) => Math.max(max, current), 0);
		const cartToPolarTransform = (pnt: Point, largestHyp: number): PolarPoint => {
			const r = hypotenuseOfPoint(pnt) / largestHyp;
			const theta = (Math.atan2(pnt.getY(), pnt.getX()) * 180) / Math.PI;
			return new PolarPoint(r, theta);
		};

		return pntCartesians.map((pnt) => cartToPolarTransform(pnt, LARGEST_HYP));
	}
}
