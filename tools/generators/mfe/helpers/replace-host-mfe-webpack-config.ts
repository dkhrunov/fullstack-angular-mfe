import { NormalizedSchema } from '@nrwl/angular/src/generators/application/lib';
import * as fs from 'fs';
import * as path from 'path';

import { replacePatterns } from '../../../pattern-engine';

/**
 * Заменить контент webpack.config для хостового микрофронта
 * @param options Normalized options
 */
export function replaceHostMfeWebpackConfig(options: NormalizedSchema): void {
	const webpackConfigPath = path.normalize(
		path.resolve(process.cwd(), options.appProjectRoot, 'webpack.config.js')
	);

	const webpackConfigPattern = fs
		.readFileSync(path.resolve(__dirname, '../patterns/host-webpack.config.txt'))
		.toString();

	const rootToWebpackTools = (options.appProjectRoot.match(new RegExp('/', 'g')) || []).reduce(
		(path) => path + '/..',
		'..'
	);

	const content = replacePatterns(webpackConfigPattern, [rootToWebpackTools, options.name]);

	fs.writeFileSync(webpackConfigPath, content);
}
