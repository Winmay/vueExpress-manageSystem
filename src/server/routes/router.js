var express = require('express');
var app = express();
var admin = require('./admin');
var list = require('./list');
var upload = require('./upload');
var ueditor = require('./ueditor');

app.use('/', admin);
app.use('/', list);
app.use('/', upload);
app.use('/', ueditor);

module.exports = app;