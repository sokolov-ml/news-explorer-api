const Article = require('../models/article');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const removeArticleById = (req, res, next) => {
  Article.removeArticleIfOwner(req.params.id, req.user._id)
    .then((article) => {
      res.send(article);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch(next);
};

// const likeArticle = (req, res, next) => {
//   Article.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
//     .orFail()
//     .then((article) => res.send(article))
//     .catch(next);
// };

// const dislikeArticle = (req, res, next) => {
//   Article.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
//     .orFail()
//     .then((article) => res.send(article))
//     .catch(next);
// };

module.exports = {
  getArticles,
  createArticle,
  removeArticleById,
  // likeArticle,
  // dislikeArticle,
};
