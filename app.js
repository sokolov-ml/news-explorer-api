require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { rateLimiter } = require('./middlewares/rate-limiter');
const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routerIndex = require('./routes/index.js');

const { PORT = 3000, DB_HOST = 'localhost', DB_PORT = 27017 } = process.env;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/news-explorer-db`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(rateLimiter);

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', routerIndex);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
