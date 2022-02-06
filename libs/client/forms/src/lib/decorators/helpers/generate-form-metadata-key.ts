export function generateMetadataKey(key: string | symbol | number) {
	if (typeof key === 'symbol') return `__metadata_form_${key.toString()}`;

	return `__metadata_form_${key}`;
}
