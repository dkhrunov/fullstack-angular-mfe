import * as fs from 'fs';
import * as path from 'path';

import { PATTERN_REGEXP } from '../patterns/pattern-regexp';

/**
 * Создать webpack.config для микрофронта
 * @param mfe Название микрофронта
 */
export function createRemoteMfeWebpackConfig(mfe: string) {
	const webpackConfigPath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', mfe, 'webpack.config.js')
	);
	const webpackConfigPattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/remote-webpack.config.txt')
	);
	const content = webpackConfigPattern.toString().replace(PATTERN_REGEXP, mfe);
	fs.writeFileSync(webpackConfigPath, content);
}
