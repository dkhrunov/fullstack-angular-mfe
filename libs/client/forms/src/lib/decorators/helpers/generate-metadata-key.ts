/**
 * Generates metadata key.
 *
 * @param id Additional identificator, that added to metadata key
 */
export function generateMetadataKey(id?: string | symbol | number) {
	if (id === undefined) return '__form-metadata__';

	if (typeof id === 'symbol') return `__metadata-${id.toString()}-form__`;

	return `__metadata-${id}-form__`;
}
