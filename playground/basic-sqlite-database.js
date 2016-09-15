var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
		forse: true
}).then(function () {
	console.log('Everything is sync');

	User.findById(1).then(function (user) {
		user.getTodos({
			where: {
				completed: true
			}
		}).then(function (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
		});
	});

// User.create({
// 	email: 'marija@vulovic.rs'
// }).then(function () {
// 	return Todo.create({
// 		description: 'Clean yard'
// 	});
// 		}).then(function (todo) { 
// 			User.findById.then(function (user) {
// 				user.addTodo(todo);
// 			});
// });

});