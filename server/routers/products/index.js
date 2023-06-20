const router = require('express').Router();
const authMiddlewares = require('../../middlewares/auth');
const numbersRouter = require('./numbers');
const NumbersManager = require('../../managers/products/numbers');
//

router.get('/', async (req, res) => {
    res.status(200).json({
        message: `Product(s) have been successfully fetched.`,
        sections: {
            numbers: await NumbersManager.getNumbersProducts(req, res)
        }
    });
});

router.use('/numbers', numbersRouter);

module.exports = router;
