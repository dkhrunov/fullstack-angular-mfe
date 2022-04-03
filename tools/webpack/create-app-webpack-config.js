const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const sharedLibs = require('./shared-libs');

/**
 * Create Webpack config for Host or Shell app.
 * @param name Name of Host or Shell app, **should be same as in workspace.json or angular.json**
 */
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
		experiments: {
			outputModule: true
		},
		resolve: {
			alias: { ...sharedLibs.getAliases() },
		},
		plugins: [
			new ModuleFederationPlugin({
				remotes: {},
				shared: sharedLibs.getShared(),
				library: {
					type: 'module'
				},
			}),
			sharedLibs.getPlugin(),
		],
	};
};
