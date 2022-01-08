const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('auth-mfe', {
	LoginModule: 'apps/client/auth-mfe/src/app/login/login.module.ts',
	RegisterModule: 'apps/client/auth-mfe/src/app/register/register.module.ts',
});
