const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('client-auth-mfe', {
	Login: 'apps/client/auth-mfe/src/app/login/login.module.ts',
	Register: 'apps/client/auth-mfe/src/app/register/register.module.ts',
});
