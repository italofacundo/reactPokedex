const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const router = require('./controllers/pokemon');

logger.info('Connecting to the API.');

const app = express();
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/pokemon', router);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
