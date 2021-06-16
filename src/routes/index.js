const routeManager = require('./manager');
const express = require('express');
const app = express.Router();
app.all('/:module/:action', routeManager);
module.exports = app;