const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('loaders-mfe', {
	SpinnerModule: 'apps/client/loaders-mfe/src/app/spinner/spinner.module.ts',
	SpinnerComponent: 'apps/client/loaders-mfe/src/app/spinner/spinner.component.ts',
});
