const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const sharedLibs = require('./shared-libs');

/**
 * Create Webpack config for Remote or Micro-frontend app.
 * @param name Name of Remote or Micro-frontend app, **should be same as in workspace.json or angular.json**
 * @param exposes Map of exposed components and modules
 */
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
    experiments: {
      outputModule: true,
    },
    resolve: {
      alias: { ...sharedLibs.getAliases() },
    },
    plugins: [
      new ModuleFederationPlugin({
        name,
        exposes,
        filename: 'remoteEntry.mjs',
        shared: sharedLibs.getShared(),
        library: {
          type: 'module',
        },
      }),
      sharedLibs.getPlugin(),
    ],
  };
};
