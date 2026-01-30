const Joi = require('joi');

const createCommentBody = Joi.object({
    content: Joi.string().min(1).max(1000).required(),
    postId: Joi.string().required(),
    userId: Joi.string().hex().length(24),
    parentCommentId: Joi.string().hex().length(24),
    likes: Joi.number().default(0),
    isEdited: Joi.boolean().default(false),
    editedAt: Joi.date
});

const createCommentSchema = {
    body: createCommentBody,
}

module.exports = createCommentSchema;