export enum Universe {
	FREE_FLY,
	CENTER,
	BIG,
	HORIZONTAL,
	VERTICAL,
	DARK,
}

export function getEnumValues(enumObj: object): number[] {
	return Object.values(enumObj).filter((value) => typeof value === "number") as number[];
}

export function getEnumName<T>(enumObj: object, value: number): string | undefined {
	const entries = Object.entries(enumObj);
	for (const [key, val] of entries) {
		if (val === value) {
			return key;
		}
	}
	return undefined;
}
