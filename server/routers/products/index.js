const router = require('express').Router();
const { readFileSync } = require('node:fs');
const locale = require('../../../locales/index');
const authMiddlewares = require('../../middlewares/auth');
const numbersRouter = require('./numbers');
const NumbersManager = require('../../managers/products/numbers');
//

router.get('/', async (req, res) => {
    const productsFile = JSON.parse(readFileSync('./././products.json'));
    const lang = locale.getLang();

    const slider = productsFile.slider;
    const news = productsFile.news;
    const marquee = productsFile.marquee[lang] || productsFile.marquee["en"];
    for (let i=0;i<Math.max(slider.length, news.length);i++) {
        if (slider[i]) slider[i].thumbnail = slider[i].thumbnail[lang] || slider[i].thumbnail["en"];
        if (news[i]) {
            news[i].title = news[i].title[lang] || news[i].title["en"];
            news[i].message = news[i].message[lang] || news[i].message["en"];
        }
    }



    res.status(200).json({
        message: `Product(s) have been successfully fetched.`,
        slider,
        news,
        marquee,
        sections: [
            await NumbersManager.getNumbersProducts(req, res)
        ]
    });
});

router.use('/numbers', numbersRouter);

module.exports = router;
