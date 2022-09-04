module.exports = {
	name: 'client-loaders-mfe',
	exposes: {
		SpinnerModule: 'apps/client/loaders-mfe/src/app/spinner/spinner.module.ts',
		SpinnerComponent: 'apps/client/loaders-mfe/src/app/spinner/spinner.component.ts',
		StandaloneSpinnerComponent:
			'apps/client/loaders-mfe/src/app/standalone-spinner/standalone-spinner.component.ts',
	},
};
