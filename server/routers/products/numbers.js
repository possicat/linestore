const router = require('express').Router();
const authMiddlewares = require('../../middlewares/auth');
const numbersController = require('../../controllers/products/numbers');
//

router.get('/', numbersController.getProducts);
router.get('/:service/:country', numbersController.getProduct);
router.use(authMiddlewares.isLogined, authMiddlewares.isVerified);
router.post('/order/:service/:country', numbersController.orderProduct);
router.post('/check/:order_id', numbersController.checkOrder);
router.post('/cancel/:order_id', numbersController.cancelOrder);

module.exports = router;
