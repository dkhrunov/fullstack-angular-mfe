const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('client-fallbacks-mfe', {
	MfeFallback: 'apps/client/fallbacks-mfe/src/app/mfe-fallback/mfe-fallback.module.ts',
	NotFound: 'apps/client/fallbacks-mfe/src/app/not-found/not-found.module.ts',
});
