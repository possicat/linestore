const router = require('express').Router();
const rateLimit = require("express-rate-limit");
const authMiddlewares = require('../middlewares/auth');
const cardsController = require('../controllers/cards');
const checkLimiter = rateLimit({
    windowMs: 1000 * 60 * 3,
    max: 35,
    message: `Too many requests, please try again later after 1 minute`
});
//

router.get('/', authMiddlewares.isAdmin, cardsController.getCards);
router.post('/create', authMiddlewares.isAdmin, cardsController.createCards);
router.get('/:serial_number', cardsController.getCard);
router.post('/check', checkLimiter, authMiddlewares.isVerified, cardsController.checkCard);
router.post('/:serial_number/activate', authMiddlewares.isAdmin, cardsController.activateCard);
router.delete('/:serial_number', authMiddlewares.isAdmin, cardsController.deleteCard);
router.post('/charge/@me', checkLimiter, authMiddlewares.isVerified, cardsController.chargeCard);
router.post('/charge/:user_id', authMiddlewares.isAgent, cardsController.chargeCard);


module.exports = router;
