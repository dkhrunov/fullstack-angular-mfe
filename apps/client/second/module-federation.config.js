module.exports = {
	name: 'client-second',
	exposes: {
		'./Module': 'apps/client/second/src/app/remote-entry/entry.module.ts',
	},
};
