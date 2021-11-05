const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { usersLogin, createUser } = require('./controllers/users');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const { PORT = 3000 } = process.env;


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
});
const app = express();

app.use(requestLogger); // подключаем логгер запросов

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedCors = [
  'https://sunrise-mesto.nomoredomains.icu',
  'http://sunrise-mesto.nomoredomains.icu',
  'http://api.sunrise-mesto.nomoredomains.rocks',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({tlds:{allow: false}}).required(),
    password: Joi.string().required().min(2).max(30),
  }),
}), usersLogin);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email({tlds: {allow: false}}).required(),
    password: Joi.string().required().min(2),
  }),
}), createUser);


app.use(cors(allowedCors));
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);
app.use('/', (req, res, next) => next(new NotFoundError('Ресурс не найден')));
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(error);

app.listen(PORT, () => console.log(`App listining on port: ${PORT}`));