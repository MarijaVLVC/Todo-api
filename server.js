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

});

// POST  /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'complited'); // use _.pick to only pick description and complited


db.todo.create(body).then(function (todo) {
	res.json(todo.toJSON());
}, function (e) {
	res.status(400).json(e);
});


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
		res.json(user.toPublicJSON());
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