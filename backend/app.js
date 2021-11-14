require('dotenv').config();
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
const router = require('express').Router();

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://api.sunrise-mesto.nomoredomains.rocks',
  'http://api.sunrise-mesto.nomoredomains.rocks',
  'https://sunrise-mesto.nomoredomains.icu',
  'http://sunrise-mesto.nomoredomains.icu',
];

// app.use(function (req, res, next) {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   // проверяем, что источник запроса есть среди разрешённых 
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
//   // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
//   const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
//   const requestHeaders = req.headers['access-control-request-headers'];
//   // Если это предварительный запрос, добавляем нужные заголовки
//   if (method === 'OPTIONS') {
//     // разрешаем кросс-доменные запросы любых типов (по умолчанию) 
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     // разрешаем кросс-доменные запросы с этими заголовками
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // завершаем обработку запроса и возвращаем результат клиенту
//     return res.end();
//   }
//   next();
// });


const { PORT = 3000 } = process.env;


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
});
const app = express();

// app.use(cors({
//   credentials: true,
//   origin:'sunrise-mesto.nomoredomains.icu',
// }));

// const options = {
//   "origin": [
//     'http://localhost:3000',
//     'http://localhost:3001',
//     'https://api.sunrise-mesto.nomoredomains.rocks',
//     'http://api.sunrise-mesto.nomoredomains.rocks',
//     'https://sunrise-mesto.nomoredomains.icu',
//     'http://sunrise-mesto.nomoredomains.icu',
//   ],
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// };

app.use(cors())

app.use(requestLogger); // подключаем логгер запросов

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required().min(2).max(30),
  }),
}), usersLogin);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required().min(2),
  }),
}), createUser);

app.use('/', auth, users);
app.use('/', auth, cards);
app.use('/users', users);
app.use('/cards', cards);
router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(error);

app.listen(PORT, () => console.log(`App listining on port: ${PORT}`));