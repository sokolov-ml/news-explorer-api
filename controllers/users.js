const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ObjectAlreadyExistsError = require('../errors/object-already-exists-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// const getUsers = (req, res, next) => {
//   User.find({})
//     .then((data) => {
//       res.send(data);
//     })
//     .catch(next);
// };

const getUserById = (req, res, next) => {
  let userId;
  if (req.url === '/me') {
    userId = req.user._id;
  } else {
    userId = req.params.id;
  }

  User.findById(userId)
    .orFail()
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ObjectAlreadyExistsError('Email уже зарегистрирован'));
      }
    });
};

// const updateUser = (req, res, next) => {
//   const { name, about } = req.body;

//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .orFail()
//     .then((user) => res.send(user))
//     .catch(next);
// };

// const updateUserAvatar = (req, res, next) => {
//   const { avatar } = req.body;

//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
//     .then((user) => res.send(user))
//     .catch(next);
// };

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  // getUsers,
  createUser,
  getUserById,
  // updateUser,
  // updateUserAvatar,
  login,
};
