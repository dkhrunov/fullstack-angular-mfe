/**
 * Validate micro-frontend string.
 * @param mfe String
 */
export function validateMfeString(mfe: string): void {
	if (mfe.match(/.+\/.+/) === null) {
		throw new Error(
			'The mfe string should be written in this pattern "mfe-app/exposed-module"'
		);
	}
}
