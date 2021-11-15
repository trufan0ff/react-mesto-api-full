const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const router = require("express").Router();
const cards = require("../controllers/cards");

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error("Неправильный формат ссылки");
  }
  return value;
};

router.get("/cards", cards.getCards);

router.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
}), cards.createCard);

router.delete("/cards/:_id", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), cards.deleteCard);

router.put("/cards/:_id/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), cards.likeCard);

router.delete("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), cards.dislikeCard);

module.exports = router;
