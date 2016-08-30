var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('TODO API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos); 
});
// GET /todos/: id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

// POST  /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'complited'); // use _.pick to only pick description and complited

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}  

// set body.decription to be trimed
body.description = body.description.trim();

	// add if field

	body.id = todoNextId++;

	// push body into array
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

// PUT/todos/:id
app.put('/todos/:id', function  (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'complited');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	// body.hasOwnProperty('complited');

	if (body.hasOwnProperty('complited') && _.isBoolean(body.complited)) {
		validAttributes.complited = body.complited;
	} else if (body.hasOwnProperty('complited')) {
		return res.status(400).send();
	} 

	if (body.hasOwnProperty('descrition') && _.isString(body.descrition) && body.descrition.trim().length > 0) {
		validAttributes.descrition = body.descrition;
	} else if (body.hasOwnProperty('descrition')) {
		return res.status(400).send();
	}

	// HERE

	 _.extend(matchedTodo, validAttributes);
	 res.json(matchedTodo);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});