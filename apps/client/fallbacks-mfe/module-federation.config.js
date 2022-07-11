module.exports = {
	name: 'client-fallbacks-mfe',
	exposes: {
		MfeFallbackModule: 'apps/client/fallbacks-mfe/src/app/mfe-fallback/mfe-fallback.module.ts',
		MfeFallbackComponent:
			'apps/client/fallbacks-mfe/src/app/mfe-fallback/mfe-fallback.component.ts',
		NotFoundModule: 'apps/client/fallbacks-mfe/src/app/not-found/not-found.module.ts',
		NotFoundComponent: 'apps/client/fallbacks-mfe/src/app/not-found/not-found.component.ts',
	},
};
