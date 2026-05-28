const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const handleValidationErrors = require('../middlewares/ValidationErrorHandler');
const { registerValidationRules, loginValidationRules } = require('../validators/authValidator');
const authenticateToken = require('../middlewares/authenticateToken');
const uploadSingleImage = require('../middlewares/uploadMiddleware').uploadSingleImage;
const imageProcessingMiddleware = require('../middlewares/imageProcessingMiddleware');

router.post('/register',
    registerValidationRules(),
    handleValidationErrors,
    authController.register
);

router.post('/login',
    loginValidationRules(),
    handleValidationErrors,
    authController.login
);

router.get('/me',
    authenticateToken,
    authController.getMe
);

router.patch('/update-my-avatar',
    authenticateToken,
    uploadSingleImage('avatar'),
    imageProcessingMiddleware.resizeImage,
    authController.updateMyAvatar
);

router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;
