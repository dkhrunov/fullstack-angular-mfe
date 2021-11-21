import { baseConfig, IConfig } from '@nx-mfe/client/config';

export const environment: IConfig = {
	...baseConfig,
	production: true,
};
