export type NumberInput = string | number | null | undefined;

export function isNumberValue(value: unknown): boolean {
	return !isNaN(parseFloat(value as any)) && !isNaN(Number(value));
}

export function coerceNumber(value: unknown): number;
export function coerceNumber<T>(value: unknown, fallback: T): number | T;
export function coerceNumber(value: unknown, fallbackValue = 0) {
	return isNumberValue(value) ? Number(value) : fallbackValue;
}
