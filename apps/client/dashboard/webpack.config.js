const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('dashboard', {
	EntryModule: 'apps/client/dashboard/src/app/remote-entry/entry.module.ts',
});
