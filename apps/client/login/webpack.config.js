const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('login', {
	EntryModule: 'apps/client/login/src/app/remote-entry/entry.module.ts',
});
