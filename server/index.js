const router = require('express').Router();
const authRouter = require('./routers/auth');
const authMiddlewares = require('./middlewares/auth');
const usersRouter = require('./routers/users');
const cardsRouter = require('./routers/cards');
const productsRouter = require('./routers/products/index');
const invitationsRouter = require('./routers/invitations');
const couponsRouter = require('./routers/coupons');
const ordersRouter = require('./routers/orders');
//

router.use('/auth', authRouter);
router.use('/users', authMiddlewares.isLogined, usersRouter);
router.use('/cards', authMiddlewares.isLogined, cardsRouter);
router.use('/products', productsRouter);
router.use('/invitations', authMiddlewares.isLogined, authMiddlewares.isVerified, invitationsRouter);
router.use('/coupons', authMiddlewares.isLogined, authMiddlewares.isVerified, couponsRouter);
router.use('/orders', authMiddlewares.isLogined, authMiddlewares.isVerified, ordersRouter);

module.exports = router;
