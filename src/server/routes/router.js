var express = require('express');
var app = express();
var admin = require('./admin');
var list = require('./list');
var product = require('./product');
var category = require('./category');
var upload = require('./upload');
var ueditor = require('./ueditor');

app.use('/', admin);
app.use('/', list);
app.use('/', product);
app.use('/', category);
app.use('/', upload);
app.use('/', ueditor);

module.exports = app;