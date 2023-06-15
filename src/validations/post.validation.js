const Joi = require("joi");

const uploadPost = {
  body: Joi.object().keys({
    created_by: Joi.string(),
    user_profile_pic: Joi.string(),
    posted_person_name: Joi.string(),
    posted_photos: Joi.array(),
    likes: "",
    caption: Joi.string().required(),
    location: Joi.string().required(),
  }),
};

const getPost = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const validateComment = {
  body: Joi.object().keys({
    created_by: Joi.string(),
    comment: Joi.string().required(),
    likes: "",
  }),
};

module.exports = {
  uploadPost,
  getPost,
  validateComment,
};
