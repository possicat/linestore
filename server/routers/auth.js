const router = require('express').Router();
const rateLimit = require("express-rate-limit");
const authMiddlewares = require('../middlewares/auth');
const authController = require('../controllers/auth');
const loginLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,
    max: 25,
    message: `Too many requests, please try again later after 1 minute`
});
const forgotLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,
    max: 10,
    message: `Too many requests, please try again later after 1 minute`
});
const checkLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,
    max: 35,
    message: `Too many requests, please try again later after 1 minute`
});
//

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/verification', authMiddlewares.isLogined, authController.verification);
router.get('/verify', authController.verify);
router.post('/forgot-password', forgotLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.resetPassword);
router.get('/check-username/:username', checkLimiter, authController.isAvailableUsername);


module.exports = router;
