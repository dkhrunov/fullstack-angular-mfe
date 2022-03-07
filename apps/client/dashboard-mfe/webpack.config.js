const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('client-dashboard-mfe', {
	EntryModule: 'apps/client/dashboard-mfe/src/app/remote-entry/entry.module.ts',
	EntryComponent: 'apps/client/dashboard-mfe/src/app/remote-entry/entry.component.ts',
});
