const routerIndex = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const ResourceNotFoundError = require('../errors/resource-not-found');

const routerUsers = require('./users');
const routerArticles = require('./articles');

const { login, createUser } = require('../controllers/users');

routerIndex.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
    }),
  }),
  login,
);
routerIndex.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string()
        .required()
        .min(2)
        .pattern(/^[\S]+$/i),
    }),
  }),
  createUser,
);

routerIndex.use(auth);
routerIndex.use('/users', routerUsers);
routerIndex.use('/articles', routerArticles);

routerIndex.use('*', (req, res, next) => {
  next(new ResourceNotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = routerIndex;
