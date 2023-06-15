const Joi = require("joi");

const uploadVideo = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    video: "",
  }),
};


module.exports = {
  uploadVideo,
};
