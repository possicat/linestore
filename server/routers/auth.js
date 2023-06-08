const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const authController = require('../controllers/auth');
//

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verification', authMiddlewares.isLogined, authController.verification);
router.get('/verify', authController.verify);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.resetPassword);
router.get('/check-username/:username', authController.isAvailableUsername);


module.exports = router;
