const Joi = require('joi');

const createUserBody = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().messages({
        'string.content': 'Invalid content',
    }),
    author: Joi.string().min(3).max(30).required(),
    userId: Joi.string().hex().length(24).default(''),
    tags: Joi.array().items(Joi.string()),
    published: Joi.boolean().default(false),
    likes: Joi.number().default(0)
}).required();

const createUserSchema = {
    body: createUserBody,
}

module.exports = createUserSchema;