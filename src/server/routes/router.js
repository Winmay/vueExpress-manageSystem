var express = require('express');
var app = express();
var admin = require('./admin');
var list = require('./list');

app.use('/', admin);
app.use('/', list);

module.exports = app;