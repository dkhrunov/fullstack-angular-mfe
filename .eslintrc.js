module.exports = {
	extends: ['plugin:@angular-eslint/recommended'],
	parserOptions: {
		project: "./tsconfig.base.json"
	},
	rules: {
		'@angular-eslint/component-selector': ['off'],
		'@typescript-eslint/no-non-null-assertion': ['off'],
		'@typescript-eslint/no-inferrable-types': ['off'],
		'@angular-eslint/no-inputs-metadata-property': ['off'],
		'@angular-eslint/no-host-metadata-property': ['off'],
		'max-len': ['error', 160],
		'@angular-eslint/no-input-rename': ['off'],
		'@angular-eslint/component-class-suffix': ['off'],
		'@angular-eslint/directive-class-suffix': ['off'],
		'quotes': ["error", "single", { allowTemplateLiterals: true }]
	},
	overrides: [
		{
			files: ['*.component.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
			plugins: ['@angular-eslint/template'],
			processor: '@angular-eslint/template/extract-inline-html',
		},
	],
};
