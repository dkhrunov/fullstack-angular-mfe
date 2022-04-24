module.exports = {
	name: 'client-todo-mfe',
	exposes: {
		'./Module': 'apps/client/todo-mfe/src/app/remote-entry/entry.module.ts',
	},
};
