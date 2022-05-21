module.exports = {
	name: 'client-auth-mfe',
	exposes: {
		Login: 'apps/client/auth-mfe/src/app/login/login.module.ts',
		Register: 'apps/client/auth-mfe/src/app/register/register.module.ts',
	},
};
