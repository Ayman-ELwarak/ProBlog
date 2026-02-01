const Joi = require("joi");

const toggleLikeBody = Joi.object({
  targetId: Joi.string().hex().length(24).required(),
  targetType: Joi.string().valid("Post", "Comment").required().messages({
    "any.only": "Post Or Comment Only",
  }),
}).required();

const toggleLikeSchema = {
  body: toggleLikeBody,
};

module.exports = toggleLikeSchema;
