import { baseConfig } from './base-config';
import { IConfig } from './interfaces';

export const baseProdConfig: IConfig = {
	...baseConfig,
	production: true,
};
