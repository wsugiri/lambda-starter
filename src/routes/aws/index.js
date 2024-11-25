const app = require('express').Router();
const handler = require('../../utils/handler');

app.post('/lambda/invoke', handler.load('aws/lambda', 'invoke'));

module.exports = app;