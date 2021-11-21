const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const { share } = require('@angular-architects/module-federation/webpack');

const sharedMappings = new mf.SharedMappings();

sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
	'@nx-mfe/shared/data-access-user',
	'@nx-mfe/client-core',
	'@nx-mfe/client-config',
	'@nx-mfe/client-auth',
	'@nx-mfe/client-token-manager',
]);

module.exports = {
	getAliases: () => sharedMappings.getAliases(),
	getShared: () =>
		share({
			'@angular/core': { singleton: true, strictVersion: true },
			'@angular/common': {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			'@angular/common/http': {
				singleton: true,
				strictVersion: true,
			},
			'@angular/router': { singleton: true, strictVersion: true },
			rxjs: {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			'ng-zorro-antd': {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
				includeSecondaries: true,
			},
			...sharedMappings.getDescriptors(),
		}),
	getPlugin: () => sharedMappings.getPlugin(),
};
