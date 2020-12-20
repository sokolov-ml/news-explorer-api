const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const LoginFailedError = require('../errors/login-failed-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Вы должны ввести корректный адрес электронной почты!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new LoginFailedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new LoginFailedError('Неправильные почта или пароль'));
        }

        return user; // теперь user доступен
      });
    });
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
