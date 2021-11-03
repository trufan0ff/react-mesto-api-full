const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden');

const cathIdError = function (res, card) {
  if (!card) {
    throw new NotFoundError('Данные не найдены');
  }
  return res.send({ data: card });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
  .then(card => res.status(200).send({ card }))
  .catch(next);
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
}

module.exports.deleteCard = (req, res, next) => Card.findById(req.params.cardId)
.then((card) => {
  if (!card) {
    throw new NotFoundError('Данные не найдены');
  }
  if (req.user._id !== card.owner.toString()) {
    throw new Forbidden('Доступ запрещён');
  }
  Card.findByIdAndRemove(req.params.cardId)
  .then(res.status(200).send({ message: 'Удалено' }))
})
.catch(next);

module.exports.likeCard = (req, res, next) =>  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true })
  .then((card) => cathIdError(res, card))
  .catch(next);

module.exports.dislikeCard = (req, res, next) =>  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },)
  .then((card) => cathIdError(res, card))
  .catch(next);

