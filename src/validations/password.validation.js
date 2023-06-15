const Joi = require("joi");

const validatePassword = {
  body: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required(),
  }),
};

module.exports = {
  validatePassword,
};
