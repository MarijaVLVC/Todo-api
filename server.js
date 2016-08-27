var express = require('express');
var bodyParser = require('body-parser');

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
	var matchedTodo;

	// Iterate of todos array, Find the match
	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});

	// res.status(404).send();

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

// POST  /todos
app.post('/todos', function (req, res) {
	var body = req.body;

	// add if field

	body.id = todoNextId++;

	// push body into array
	todos.push(body);

	res.json(body);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});