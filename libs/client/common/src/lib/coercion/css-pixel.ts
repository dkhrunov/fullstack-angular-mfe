export function coerceCssPixel(value: unknown): string {
	if (value == null) {
		return '';
	}

	return typeof value === 'string' ? value : `${value}px`;
}
