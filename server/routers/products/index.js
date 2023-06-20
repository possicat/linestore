const router = require('express').Router();
const { readFileSync } = require('node:fs');
const authMiddlewares = require('../../middlewares/auth');
const numbersRouter = require('./numbers');
const NumbersManager = require('../../managers/products/numbers');
//

router.get('/', async (req, res) => {
  const productsFile = JSON.parse(readFileSync('./././products.json'));
    res.status(200).json({
        message: `Product(s) have been successfully fetched.`,
        slider: productsFile.slider,
        sections: [
            await NumbersManager.getNumbersProducts(req, res)
        ]
    });
});

router.use('/numbers', numbersRouter);

module.exports = router;
