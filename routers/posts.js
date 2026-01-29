const express = require('express');
const postsController = require('../controllers/posts');
const validate = require('../middlewares/validate');
const schema = require('../schemas')
const authenticate = require('../middlewares/authenticate')

const router = express.Router();

router.post('/', authenticate, validate(schema.post.createPostSchema), postsController.createPost);

router.get('/', authenticate, postsController.getAllPosts);

router.get('/:id', authenticate, postsController.getPostById);

router.patch('/:id', authenticate, postsController.updatePost)

router.delete('/:id', authenticate, postsController.deletePost);

module.exports = router;