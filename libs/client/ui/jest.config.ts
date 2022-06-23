/* eslint-disable */
export default {
	displayName: 'client-ui',
	preset: '../../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
		},
	},
	coverageDirectory: '../../../coverage/libs/client/ui',
	transform: { '^.+.(ts|mjs|js|html)$': 'jest-preset-angular' },
	// fix `Unexpected token 'export'` error https://github.com/nrwl/nx/issues/7844#issuecomment-1016624608
	transformIgnorePatterns: [`node_modules/(?!@angular|carbon-components-angular|@carbon/icons)`],
	snapshotSerializers: [
		'jest-preset-angular/build/serializers/no-ng-attributes',
		'jest-preset-angular/build/serializers/ng-snapshot',
		'jest-preset-angular/build/serializers/html-comment',
	],
};
