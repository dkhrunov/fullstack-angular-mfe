import * as fs from 'fs';
import * as path from 'path';

import { replacePatterns } from '../../../pattern-engine';

/**
 * Заменить контент webpack.config для хостового микрофронта
 * @param mfe Название микрофронта
 */
export function replaceHostMfeWebpackConfig(mfe: string): void {
	const webpackConfigPath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', mfe, 'webpack.config.js')
	);
	const webpackConfigPattern = fs
		.readFileSync(path.resolve(__dirname, '../patterns/host-webpack.config.txt'))
		.toString();

	const content = replacePatterns(webpackConfigPattern, [mfe]);
	fs.writeFileSync(webpackConfigPath, content);
}
