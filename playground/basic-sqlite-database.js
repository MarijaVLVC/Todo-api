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
	complited: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
		forse: true
}).then(function () {
	console.log('Everything is sync');

	Todo.findById(2).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo not found');
		}
	});

	// Todo.create({
	// 	description: 'Walk my dog',
	// 	complited: false
	// }).then(function (todo) {
	// 	return Todo.create({
	// 		 description: 'Clean office'
	// 	});

	// }).then(function () {
	// 	// return Todo.findById(1)
	// 	return Todo.findAll({
	// 		where: {
	// 			description:  {
	// 				$like: '%office%'
	// 			}
	// 		}
	// 	})
	// }).then(function (todos){
	// 	if (todos) {
	// 		todos.forEach(function (todo) {
	// 			console.log(todo.toJSON());
	// 		});
			
	// 	} else {
	// 		console.log('No todo found');
	// 	}
	// }).catch(function (e) {
	// 	console.log(e);
	// });
});