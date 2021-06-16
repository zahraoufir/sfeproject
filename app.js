const initialize = require('./src/config/initialize'); initialize();
const cors = require('cors');
const express = require('express');
const server = require('./src/config/server');
const routes = require('./src/routes');
const app = express();
app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use('/api',routes);
server.start(app);