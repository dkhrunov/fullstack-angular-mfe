const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const sharedLibs = require('./shared-libs');

module.exports = function (name, exposes) {
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
				filename: 'remoteEntry.js',
				exposes,
				shared: sharedLibs.getShared(),
			}),
			sharedLibs.getPlugin(),
		],
	};
};
