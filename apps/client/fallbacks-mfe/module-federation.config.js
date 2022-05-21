module.exports = {
	name: 'client-fallbacks-mfe',
	exposes: {
		MfeFallback: 'apps/client/fallbacks-mfe/src/app/mfe-fallback/mfe-fallback.module.ts',
		NotFound: 'apps/client/fallbacks-mfe/src/app/not-found/not-found.module.ts',
	},
};
