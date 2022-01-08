const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const sharedLibs = require('./shared-libs');

module.exports = function (name) {
	name = name.replace(/-/g, '_');

	return {
		output: {
			uniqueName: name,
			publicPath: 'auto',
		},
		optimization: {
			runtimeChunk: false,
			minimize: false,
		},
		resolve: {
			alias: { ...sharedLibs.getAliases() },
		},
		plugins: [
			new ModuleFederationPlugin({
				remotes: {},
				shared: sharedLibs.getShared(),
			}),
			sharedLibs.getPlugin(),
		],
	};
};
