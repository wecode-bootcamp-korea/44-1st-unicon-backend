const express = require('express');

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');

const router = require('./src/routes');

const { errorHandler } = require('./src/middlewares/error');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());

  app.use(router);

  app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
  });

  app.all('*', (req, res, next) => {
    const err = new Error(`Can't fine ${req.originalUrl} on this server`);

    err.stautsCode = 404;
    next(err);
  });

  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
