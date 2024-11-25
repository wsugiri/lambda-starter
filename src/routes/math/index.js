const app = require('express').Router();
const handler = require('../../utils/handler');

app.post('/tambah', handler.load('math', 'tambah'));
app.put('/:val1/kurang/:val2', handler.load('math', 'kurang'));
app.get('/:val1/kali/:val2', handler.load('math', 'kali'));

module.exports = app;