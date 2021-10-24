const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../../tsconfig.base.json'), [
	'@nx-mfe/shared/data-access-user',
]);

module.exports = {
	output: {
		uniqueName: 'shell',
		publicPath: 'auto',
	},
	optimization: {
		runtimeChunk: false,
		minimize: false,
	},
	resolve: {
		alias: {
			...sharedMappings.getAliases(),
		},
	},
	plugins: [
		new ModuleFederationPlugin({
			remotes: {},
			shared: {
				'@angular/core': { singleton: true, strictVersion: true },
				'@angular/common': { singleton: true, strictVersion: true },
				'@angular/common/http': {
					singleton: true,
					strictVersion: true,
				},
				'@angular/router': { singleton: true, strictVersion: true },
				rxjs: {
					singleton: true,
					strictVersion: true,
					requiredVersion: '7.4.0',
				},
				...sharedMappings.getDescriptors(),
			},
		}),
		sharedMappings.getPlugin(),
	],
};
