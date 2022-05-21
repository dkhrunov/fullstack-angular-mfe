import { environmentDev } from './environment';
import { IEnvironment } from './interfaces';

export const environmentProd: IEnvironment = {
	...environmentDev,
	production: true,
};
