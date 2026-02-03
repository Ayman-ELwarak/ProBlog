const express = require('express');
const postsController = require('../controllers/posts');
const validate = require('../middlewares/validate');
const schema = require('../schemas')
const authenticate = require('../middlewares/authenticate')
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', authenticate, validate(schema.post.createPostSchema), postsController.createPost);

router.post('/:id/images', authenticate, upload.posts, postsController.uploadPostImages);

router.delete('/:id/images/:imageId', authenticate, postsController.deletePostImage);

router.get('/', authenticate, postsController.getAllPosts);

router.get('/:id', authenticate, postsController.getPostById);

router.get('/:postId/comments', authenticate, postsController.getCommentByPostId);

router.patch('/:id', authenticate, postsController.updatePost)

router.delete('/:id', authenticate, postsController.deletePost);

module.exports = router;