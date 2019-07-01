var express = require('express');
var wikiController = require('./controllers/WikiController');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var app = express();

//var mkdirp = require('mkdirp');

// Set the default templating engine to ejs
app.set('view engine', 'ejs');

//whenever someone visits anywhere use this middlewear
app.use(express.static('./public'));//whenever someone visits assets use this middlewear

// fire controllers
wikiController(app);

app.listen(3000, '127.0.0.1');
console.log('we be listening to da port of 3000');
