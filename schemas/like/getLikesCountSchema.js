const Joi = require("joi");

const getLikesCountQuery = Joi.object({
  targetId: Joi.string().hex().length(24).required(),
  targetType: Joi.string().valid("Post", "Comment").required().messages({
    "any.only": "Post Or Comment Only",
  }),
}).required();

const getLikesCountSchema = {
  query: getLikesCountQuery,
};

module.exports = getLikesCountSchema;
