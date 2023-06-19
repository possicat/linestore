require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const locale = require('./locales/index');
const app = express();

app.set('views', __dirname + '/interfaces/views/');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/interfaces/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use(cors());

const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 71,
  message: `Too many requests, please try again later after 1 minute`
});

const router = express.Router();

router.use('/api', limiter, require('./server/index'));
router.use('/', require('./interfaces/index'));
router.all('*', async (req, res) => res.status(404).render('404'));

function localization (req, res, next) {
  const selectedLang = req.baseUrl.replaceAll('/', '').trim().toLowerCase();
  locale.setLang(selectedLang);
  
  next();
}

app.use('/en', localization, router);
app.use('/ar', localization, router);
app.use('/', localization, router);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  const server = app.listen(process.env.PORT, () => console.log(`App is online with port ${server.address().port}`));
}).catch(err => console.error(err));

