const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('client-fallbacks-mfe', {
	MfeFallbackModule: 'apps/client/fallbacks-mfe/src/app/mfe-fallback/mfe-fallback.module.ts',
	MfeFallbackComponent:
		'apps/client/fallbacks-mfe/src/app/mfe-fallback/mfe-fallback.component.ts',
});
