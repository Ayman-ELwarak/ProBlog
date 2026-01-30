const express = require('express');
const commentsController = require('../controllers/comments');
const validate = require('../middlewares/validate');
const schema = require('../schemas')
const authenticate = require('../middlewares/authenticate')

const router = express.Router();

router.post('/', authenticate, validate(schema.comment.createCommentSchema), commentsController.createComment);

router.get('/', authenticate, commentsController.getAllComments);

router.get('/:id', authenticate, commentsController.getCommentById);

router.patch('/:id', authenticate, commentsController.updateComment)

router.delete('/:id', authenticate, commentsController.deleteComment);

module.exports = router;