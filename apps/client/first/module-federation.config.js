module.exports = {
	name: 'client-first',
	exposes: {
		'./Module': 'apps/client/first/src/app/remote-entry/entry.module.ts',
	},
};
