const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const ResourceNotFoundError = require('../errors/resource-not-found');

const routerUsers = require('./users');
const routerCards = require('./articles');

const { login, createUser } = require('../controllers/users');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
    }),
  }),
  login,
);
router.post(
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

router.use(auth);
router.use('/users', routerUsers);
router.use('/articles', routerCards);

router.use('*', (req, res, next) => {
  next(new ResourceNotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
