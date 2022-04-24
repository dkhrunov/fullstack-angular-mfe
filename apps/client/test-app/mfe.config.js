module.exports = {
	name: 'client-test-app',
	remotes: [],
	shared: (name, config) => {
		// TODO есть проблема не могу сюда добавить кастомную зависимость Ng-Zorro
		// создал PR на GitHub в nrwl/nx
		console.log(name, config);
		return config;
	},
};
