const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const { share } = require('@angular-architects/module-federation/webpack');
const tsConfig = require('../../tsconfig.base.json');

/**
 * Получить client и shared библиотеки из tsconfig.base.json
 * @returns {null|string[]}
 */
function getSharedLibs() {
  const CLIENT_LIB_REGEXP = /^@.+\/client|shared\/(.+)$/g;

  if (!tsConfig?.compilerOptions?.paths) {
    return null;
  }

  return Object.keys(tsConfig.compilerOptions.paths).filter((libName) =>
    libName.match(CLIENT_LIB_REGEXP)
  );
}

/**
 * We use the NX_TSCONFIG_PATH environment variable when using the @nrwl/angular:webpack-browser
 * builder as it will generate a temporary tsconfig file which contains any required remappings of
 * shared libraries.
 * A remapping will occur when a library is buildable, as webpack needs to know the location of the
 * built files for the buildable library.
 * This NX_TSCONFIG_PATH environment variable is set by the @nrwl/angular:webpack-browser and it contains
 * the location of the generated temporary tsconfig file.
 */
const tsConfigPath =
  process.env.NX_TSCONFIG_PATH ?? path.join(__dirname, '../../tsconfig.base.json');

const workspaceRootPath = path.join(__dirname, '../../');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  tsConfigPath,
  [
    /* mapped paths to share */
    ...getSharedLibs(),
  ],
  workspaceRootPath
);

module.exports = {
  getAliases: () => sharedMappings.getAliases(),
  getShared: () =>
    share({
      '@angular/core': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@angular/common': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@angular/common/http': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@angular/router': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      rxjs: {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      'ng-zorro-antd': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      '@dekh/ngx-jwt-auth': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        includeSecondaries: true,
      },
      ...sharedMappings.getDescriptors(),
    }),
  getPlugin: () => sharedMappings.getPlugin(),
};
