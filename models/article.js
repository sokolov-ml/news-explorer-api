const mongoose = require('mongoose');
const validator = require('validator');

const ResourceNotFoundError = require('../errors/resource-not-found');
const AccessDeniedError = require('../errors/access-denied-error');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Вы должны ввести ссылку!',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Вы должны ввести ссылку!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

articleSchema.statics.removeArticleIfOwner = function (articleId, currentUser) {
  return this.findById(articleId)
    .select('+owner')
    .orFail()
    .then((article) => {
      if (article.owner.toString() !== currentUser) {
        return Promise.reject(new AccessDeniedError('Вы не владелец этой статьи'));
      }
      return article.remove();
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new ResourceNotFoundError('Статья не найдена');
      }
    });
};

articleSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.owner;
  return obj;
};

module.exports = mongoose.model('article', articleSchema);
