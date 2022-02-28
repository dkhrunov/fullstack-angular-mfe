const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const sharedLibs = require('./shared-libs');
const config = require('../../mfe-config.json');

module.exports = function (name, exposes) {
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
				name,
				exposes,
				filename: config.remoteEntryFileName,
				shared: sharedLibs.getShared(),
			}),
			sharedLibs.getPlugin(),
		],
	};
};
