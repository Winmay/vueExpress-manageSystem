var express = require('express');
var app = express();
var admin = require('./admin');
var list = require('./list');
var upload = require('./upload');

app.use('/', admin);
app.use('/', list);
app.use('/', upload);

module.exports = app;