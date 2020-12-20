const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/router.js');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/news-explorer-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  switch (err.name) {
    case 'Bad Request':
      if (err.message === 'celebrate request validation failed') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
          error: { name: err.name, code: err.code, message: err.message },
        });
      }

      break;
    case 'MongoError':
      if (err.code === 11000) {
        res.status(409).send({
          message: 'Email уже зарегистрирован',
          error: { name: err.name, code: err.code, message: err.message },
        });
      } else {
        res.status(500).send({
          message: 'Ошибка записи в БД',
          error: { name: err.name, code: err.code, message: err.message },
        });
      }
      break;
    case 'ValidationError':
      res.status(400).send({
        message: 'Переданы некорректные данные',
        error: { name: err.name, code: err.code, message: err.message },
      });
      break;
    case 'CastError':
      res.status(400).send({
        message: 'Некорректный идентификатор',
        error: { name: err.name, code: err.code, message: err.message },
      });
      break;
    case 'DocumentNotFoundError':
      res.status(404).send({
        message: 'Объект не найден',
        error: { name: err.name, code: err.code, message: err.message },
      });
      break;
    case 'AccessDenied':
      res.status(403).send({
        message: 'Доступ запрещён',
        error: { name: err.name, code: err.code, message: err.message },
      });
      break;
    case 'LoginFailed':
      res.status(401).send({
        message: 'Неправильная почта или пароль',
        error: { name: err.name, code: err.code, message: err.message },
      });
      break;
    case 'ResourceNotFound':
      res.status(404).send({
        message: 'Ресурс не найден',
        error: { name: err.name, code: err.code, message: err.message },
      });
      break;
    default:
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        error: { name: err.name, code: err.code, message: err.message },
      });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
