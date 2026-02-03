const express = require('express');
const usersController = require('../controllers/users');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');
const restrictTo = require('../middlewares/restricatTo');
const schemas = require('../schemas');

const router = express.Router();

router.post('/signUp', validate(schemas.user.signUpSchema), usersController.signUp);

router.post('/signIn', validate(schemas.user.signInSchema), usersController.signIn);

router.post('/profile-picture', authenticate, upload.profile, usersController.updateProfilePicture);

router.delete('/profile-picture', authenticate, usersController.deleteProfilePicture)

router.get('/',authenticate, restrictTo(['admin']), validate(schemas.user.getAllUsersSchema), usersController.getAllUsers);

router.get('/:id', usersController.getUserById);

router.get('/:userId/likes', usersController.getUserLikes);

router.patch('/:id', validate(schemas.user.updateUserSchema), usersController.updateUser)

router.delete('/:id', usersController.deleteUser);

module.exports = router;