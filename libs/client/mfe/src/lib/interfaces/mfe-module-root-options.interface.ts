import { IMfeConfig } from './mfe-config.interface';
import { IWorkspaceConfig } from './workspace-config.interface';

// TODO jsDoc
export interface IMfeModuleRootOptions {
	mfeConfig: IMfeConfig;
	workspaceConfig: IWorkspaceConfig;
	mfeProjectPattern?: RegExp;
	mfePrefix?: string;
	mfePostfix?: string;
	preload?: string[];
	delay?: number;
	loader?: string;
	fallback?: string;
}
