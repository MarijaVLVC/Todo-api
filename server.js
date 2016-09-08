var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('TODO API Root');
});

// GET /todos?complited=false&q=work
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {}; 

	if (query.hasOwnProperty('complited') && query.complited === 'true') {
		where.complited = true;
	} else if (query.hasOwnProperty('complited') && query.complited === 'false') {
		where.complited = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0 ) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function () {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});
	// var filteredTodos = todos;

	// // if has property && complited === 'true'
	// // filteredTodos == _.where(filteredTodos, ?)
	// // else id has prop && complited if 'false'

	// if (queryParams.hasOwnProperty('complited') && queryParams.complited === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {complited:true});
	// } else if  (queryParams.hasOwnProperty('complited') && queryParams.complited === '˙false') {
	// 	filteredTodos = _.where(filteredTodos, {complited:false});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function (todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredTodos); 
});
// GET /todos/: id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});

	// var matchedTodo = _.findWhere(todos, {id: todoId});

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }
});

// POST  /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'complited'); // use _.pick to only pick description and complited

// call create on db.todo
// respond with 200 and todo
// e res.status(400).json(e)

db.todo.create(body).then(function (todo) {
	res.json(todo.toJSON());
}, function (e) {
	res.status(400).json(e);
});

// 	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
// 		return res.status(400).send();
// 	}  

// // set body.decription to be trimed
// body.description = body.description.trim();

// 	// add if field

// 	body.id = todoNextId++;

// 	// push body into array
// 	todos.push(body);

// 	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todoid'
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	});

	// var matchedTodo = _.findWhere(todos, {id: todoId});

	// if (matchedTodo) {
	// 	res.status(404).json({"error": "no todo found with that id"});
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo);
	// }
});

// PUT/todos/:id
app.put('/todos/:id', function  (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'complited');
	var attributes = {};


	// body.hasOwnProperty('complited');

	if (body.hasOwnProperty('complited') ) {
		attributes.complited = body.complited;
	} 

	if (body.hasOwnProperty('descrition')) {
		attributes.descrition = body.descrition;
	} 

	db.todo.findById(todoId).then(function (todo) {
		if (todo ) {
		 todo.update(attributes).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).send();
	});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});
});

app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'passsword');

	db.user.create(body).then(function (user) {
		res.json(user.toJSON());
	}, function () {
		res.status(400).json(e);
	});
});

db.sequelize.sync().then(function () {
	 res.json(matchedTodo);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});