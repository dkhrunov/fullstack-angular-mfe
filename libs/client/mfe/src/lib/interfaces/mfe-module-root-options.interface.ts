import { IMfeConfig } from './mfe-config.interface';
import { IWorkspaceConfig } from './workspace-config.interface';

export interface IMfeModuleRootOptions {
	mfeConfig: IMfeConfig;
	workspaceConfig: IWorkspaceConfig;
	preload?: string[];
}
