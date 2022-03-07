const createMfeWebpackConfig = require('../../../tools/webpack/create-mfe-webpack-config');

module.exports = createMfeWebpackConfig('client-auth-mfe', {
	LoginModule: 'apps/client/auth-mfe/src/app/login/login.module.ts',
	LoginComponent: 'apps/client/auth-mfe/src/app/login/login.component.ts',
	RegisterModule: 'apps/client/auth-mfe/src/app/register/register.module.ts',
	RegisterComponent: 'apps/client/auth-mfe/src/app/register/register.component.ts',
});
