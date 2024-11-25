require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const app = express();

exports.api = async (event, context, args) => {
    const route = require('./src/routes');

    app.use(express.json());
    route.instance(app);

    if (event.name && event.action) {
        // console.log('-- name --', event.name, event.action, event.body);
        return require(`./src/handlers/${event.name}`)[event.action](event);
    }

    return serverless(app)(event, context, args);
};