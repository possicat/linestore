const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const ordersController = require('../controllers/orders');
//

router.get('/', authMiddlewares.isAdmin, ordersController.getOrders);
router.get('/@me', ordersController.getMyOrders);
router.get('/:order_id', ordersController.getOrders);

module.exports = router;
