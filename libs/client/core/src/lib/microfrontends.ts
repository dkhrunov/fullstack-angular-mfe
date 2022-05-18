import { MfeConfig } from '@nx-mfe/client/mfe';

export const microfrontend: MfeConfig = {
	'client-auth-mfe': 'http://localhost:4201/remoteEntry.js',
	'client-dashboard-mfe': 'http://localhost:4202/remoteEntry.js',
	'client-loaders-mfe': 'http://localhost:4203/remoteEntry.js',
	'client-fallbacks-mfe': 'http://localhost:4204/remoteEntry.js',
};
