export type BooleanInput = string | boolean | null | undefined;

export function coerceBoolean(value: unknown): boolean {
	return value != null && `${value}` !== 'false';
}
