const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-error');
const LoginPasswordError = require('../errors/login-password-error');
const ConflictErr = require('../errors/ConflictErr');


const cathIdError = function (res, user) {
  if (!user) {
    throw new NotFoundError('Данные не найдены');
  }
  return res.status(200).send({ data: user });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => cathIdError(res, user))
    .catch(next);
}

exports.getUserMe = function (req, res, next) {
  User.findById(req.user._id)
  .then((user) => cathIdError(res, user))
  .catch(next);
}

module.exports.getCurrentUsers = (req, res, next) => User.findById(req.params.id)
.then((user) => cathIdError(res, user))
.catch(next);

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body; // получим из объекта запроса имя и описание пользователя
  if (!req.body.password || req.body.password.length < 3) {
    throw new ValidationError('Слишком короткий пароль');
  }
  if (!validator.isEmail(req.body.email)) {
    throw new ValidationError('Некорректный email');
  }
  User.findOne({ email: req.body.email })
    .then((registeredUser) => {
      if (registeredUser) {
        throw new ConflictErr('Пользователь с таким email уже существует');
      }

      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => User.create({

      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch(next)
}

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name:req.body.name, about:req.body.about }, { new: true, runValidators: true },)
    .then((user) => cathIdError(res, user))
    .catch(next)
}

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
  .then((user) => cathIdError(res, user))
  .catch(next);
}
  module.exports.usersLogin = (req, res, next) => {
    const { email, password } = req.body;
    let findedUser;
    User.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          throw new LoginPasswordError('Неправильные почта или пароль');
        }
        findedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((matched) => {
        if (!matched) {
          throw new LoginPasswordError('Неправильные почта или пароль');
        }
        // создадим токен
        const token = jwt.sign({ _id: findedUser._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key' , { expiresIn: '7d' });

        // вернём токен
        res.send({ token });
      })
      .catch(next);
  };
