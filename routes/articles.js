const routerArticles = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getArticles,
  createArticle,
  removeArticleById,
  // likeArticle,
  // dislikeArticle,
} = require('../controllers/articles');

routerArticles.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string(),
      title: Joi.string(),
      text: Joi.string(),
      date: Joi.string(),
      source: Joi.string(),
      link: Joi.string().pattern(
        /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/i,
      ),
      image: Joi.string().pattern(
        /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/i,
      ),
    }),
  }),
  createArticle,
);

routerArticles.get('/', getArticles);
// routerArticles.get(
//   '/:id',
//   celebrate({
//     params: Joi.object().keys({
//       id: Joi.string().length(24).hex(),
//     }),
//   }),
//   getArticles,
// );

routerArticles.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex(),
    }),
  }),
  removeArticleById,
);

// routerArticles.put(
//   '/:id/likes',
//   celebrate({
//     params: Joi.object().keys({
//       id: Joi.string().length(24).hex(),
//     }),
//   }),
//   likeArticle,
// );
// routerArticles.delete(
//   '/:id/likes',
//   celebrate({
//     params: Joi.object().keys({
//       id: Joi.string().length(24).hex(),
//     }),
//   }),
//   dislikeArticle,
// );

module.exports = routerArticles;
