import * as fs from 'fs';
import * as path from 'path';

import { PATTERN_REGEXP } from '../patterns/pattern-regexp';
import { Schema } from '../schema';

export function createRemoteMfeWebpackConfig(schema: Partial<Schema>) {
	const webpackConfigPath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', schema.name!, 'webpack.config.js')
	);
	const webpackConfigPattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/remote-webpack.config.txt')
	);
	const content = webpackConfigPattern.toString().replace(PATTERN_REGEXP, schema.name!);
	fs.writeFileSync(webpackConfigPath, content);
}
