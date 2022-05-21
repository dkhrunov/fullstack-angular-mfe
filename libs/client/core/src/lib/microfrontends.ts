import { MfeConfig } from '@nx-mfe/client/mfe';

export const microfrontend: MfeConfig = {
	'client-auth-mfe': 'http://localhost:4201/remoteEntry.mjs',
	'client-dashboard-mfe': 'http://localhost:4202/remoteEntry.mjs',
	'client-loaders-mfe': 'http://localhost:4203/remoteEntry.mjs',
	'client-fallbacks-mfe': 'http://localhost:4204/remoteEntry.mjs',
};
