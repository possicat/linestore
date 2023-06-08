const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const couponsController = require('../controllers/coupons');
//

router.get('/', authMiddlewares.isAdmin, couponsController.getCoupons);
router.post('/create', couponsController.createCoupon);
router.post('/re-create', couponsController.reCreateCoupon);
router.post('/check', couponsController.reCreateCoupon);
router.delete('/:coupon_code', couponsController.deleteCoupon);

module.exports = router;
