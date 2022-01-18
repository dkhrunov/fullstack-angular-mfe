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

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), getSharedLibs());

module.exports = {
	getAliases: () => sharedMappings.getAliases(),
	getShared: () =>
		share({
			'@angular/core': {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			'@angular/common': {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			'@angular/common/http': {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			'@angular/router': {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			rxjs: {
				singleton: true,
				strictVersion: true,
				requiredVersion: 'auto',
			},
			'rxjs/operators': {
				singleton: true,
				strictVersion: true,
				requiredVersion: '^7',
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
