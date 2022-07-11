module.exports = {
	name: 'client-auth-mfe',
	exposes: {
		LoginModule: 'apps/client/auth-mfe/src/app/login/login.module.ts',
		RegisterModule: 'apps/client/auth-mfe/src/app/register/register.module.ts',
	},
};
