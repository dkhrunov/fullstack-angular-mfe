import * as fs from 'fs';
import * as path from 'path';

import { PATTERN_REGEXP } from '../patterns/pattern-regexp';

/**
 * Заменить контент webpack.config для хостового микрофронта
 * @param mfe Название микрофронта
 */
export function replaceHostMfeWebpackConfig(mfe: string): void {
	const webpackConfigPath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', mfe, 'webpack.config.js')
	);
	const webpackConfigPattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/host-webpack.config.txt')
	);

	// replace по regexp заменят все подходящие значения
	const content = webpackConfigPattern.toString().replace(PATTERN_REGEXP, mfe);
	fs.writeFileSync(webpackConfigPath, content);
}
