const express = require('express');
const likeController = require('../controllers/likes');
const validate = require('../middlewares/validate');
const schema = require('../schemas')
const authenticate = require('../middlewares/authenticate')

const router = express.Router();

router.post('/', authenticate, validate(schema.like.toggleLike), likeController.toggleLike);
router.get('/count', authenticate, validate(schema.like.getLikesCount), likeController.getLikesCount);
router.get('/check', authenticate, validate(schema.like.isLikedByUser), likeController.isLikedByUser);


module.exports = router;