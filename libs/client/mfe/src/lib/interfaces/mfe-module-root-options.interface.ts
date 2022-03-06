import { IMfeConfig } from './mfe-config.interface';
import { IWorkspaceConfig } from './workspace-config.interface';

// TODO jsDoc
export interface IMfeModuleRootOptions {
	mfeConfig: IMfeConfig;
	workspaceConfig: IWorkspaceConfig;
	preload?: string[];
	loaderDelay?: number;
	loaderMfe?: string;
}
