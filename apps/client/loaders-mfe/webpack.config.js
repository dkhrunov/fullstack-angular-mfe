const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('client-loaders-mfe', {
	Spinner: 'apps/client/loaders-mfe/src/app/spinner/spinner.module.ts',
});
