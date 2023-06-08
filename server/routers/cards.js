const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const cardsController = require('../controllers/cards');
//

router.get('/', authMiddlewares.isAdmin, cardsController.getCards);
router.post('/create', authMiddlewares.isAdmin, cardsController.createCards);
router.get('/:serial_number', cardsController.getCard);
router.post('/check', authMiddlewares.isVerified, cardsController.checkCard);
router.post('/:serial_number/activate', authMiddlewares.isAdmin, cardsController.activateCard);
router.delete('/:serial_number', authMiddlewares.isAdmin, cardsController.deleteCard);
router.post('/charge/@me', authMiddlewares.isVerified, cardsController.chargeCard);
router.post('/charge/:user_id', authMiddlewares.isAgent, cardsController.chargeCard);


module.exports = router;
