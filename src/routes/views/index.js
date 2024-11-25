const express = require('express');
const app = express.Router();
const handler = require('../../utils/handler');

app.get('/', handler.load('views', 'landing'));
app.use('/', express.static('public'));
app.get('/*', handler.load('views', 'landing'));

module.exports = app;
