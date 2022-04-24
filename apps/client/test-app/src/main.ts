import { setRemoteDefinitions } from '@nrwl/angular/mfe';

fetch('/assets/mfe.manifest.json')
	.then((res) => res.json())
	.then((definitions) => setRemoteDefinitions(definitions))
	.then(() => import('./bootstrap').catch((err) => console.error(err)));
