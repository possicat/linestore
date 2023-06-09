const Card = require('../models/card');
const User = require('../models/user');
const Mailer = require('./mailer');
const locale = require('../../locales/index');
//

const createCard = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const user = req.user;
    const { balance, active } = req.body;

    try {
      const { code, codeHint, serialNumber } = await Card.generateUniqueCard(Card);
      const card = await Card.create({ serialNumber, code, codeHint, balance, createdBy: user._id, active: (!!active), ownedBy: ((!!active) ? user._id : undefined) });
      const cardInfo = { serialNumber, code, balance, createdBy: card.createdBy, active: card.active };

      return resolve(cardInfo);
    } catch (err) {
      return reject(Card.handleErrors(err));
    }

  });

};

const createCards = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("cards");

    const cardsInfo = [];
    const { count } = req.body;

    if (typeof count != "number") return reject({ count: warnings.requiredCount });
    if (!Number.isInteger(count) || count <= 0 || count > 100) return reject({ count: warnings.invalidCount });

    for (let i = 0; i < count; i++) {
      try {
        const cardInfo = await createCard(req, res);
        cardsInfo.push(cardInfo);
      } catch (err) {
        return reject(err);
      }
    }

    return resolve(cardsInfo);

  });

}

function initCardInfo(user, card) {

  const cardInfo = {};

  if (!user) user = { permissions: [] };

  for (const [key, value] of Object.entries(card._doc)) {

    if (key == "code" || key == "__v") continue;
    if (key == "_id") {
      cardInfo["id"] = value;
      continue;
    }

    if (key == "usedBy") cardInfo["used"] = true;

    if (user.permissions.includes("admin")) {
      cardInfo[key] = value;
      continue;
    }

    if (user.permissions.includes("agent")) {
      if (["codeHint", "createdBy", "usedBy", "ownedBy", "createdAt", "updatedAt"].includes(key)) continue;
      cardInfo[key] = value;
      continue;
    }

    if (!["serialNumber", "balance", "active"].includes(key)) continue;

    cardInfo[key] = value;

  }

  return cardInfo;

}

const getCardInfo = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("cards");

    const user = req.user;
    const serialNumber = req.params.serial_number;

    const card = await Card.findOne({ serialNumber: serialNumber.trim() });

    if (!card) return reject({ card: warnings.notFoundCard });

    return resolve(initCardInfo(user, card));

  });

}

const getCardsInfo = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const user = req.user;

    const cards = await Card.find({});
    const cardsInfo = [];

    for (const card of cards) {
      cardsInfo.push(initCardInfo(user, card));
    }

    return resolve(cardsInfo);

  });

}

const activateCard = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("cards");

    const user = req.user;

    const serialNumber = req.params.serial_number;
    let { ownedBy } = req.body;

    if (typeof ownedBy != "string" || !ownedBy.trim().length) ownedBy = user;
    else if (user.permissions.includes("admin")) ownedBy = await User.getUserById(ownedBy, User);

    if (!ownedBy) return reject({ ownedBy: warnings.notFoundUser });

    try {
      const card = await Card.findOne({ serialNumber: serialNumber.trim() });

      if (!card) return reject({ card: warnings.notFoundCard });
      if (card.active) return reject({ card: warnings.alreadyActivatedCard });

      card.active = true;
      card.ownedBy = ownedBy._id;

      await card.save();

      return resolve(true);
    } catch (err) {
      return reject(Card.handleErrors(err));
    }

  });

};

const checkCard = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("cards");

    const { code } = req.body;

    if (typeof code != "string" || !code.trim().length) return reject({ code: warnings.requiredCode });

    const card = await Card.getCardByCode(code, Card);

    if (!card) return reject({ code: warnings.incorrectCode });

    return resolve(initCardInfo(null, card));

  });


};

const chargeCardToAccount = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("cards");

    const user = req.user;
    const { code } = req.body;

    if (typeof code != "string" || !code.trim().length) return reject({ code: warnings.requiredCode });

    const id = req.params.user_id;
    let selectedUser = user;

    if (id) selectedUser = await User.getUserById(id, User);

    if (!selectedUser) return reject({ user: warnings.notFoundUser });

    if (!selectedUser.verified) return reject({ user: warnings.notVerifiedUser });

    try {
      const card = await Card.getCardByCode(code, Card);

      if (!card) return reject({ code: warnings.incorrectCode });

      if (card.usedBy) return reject({ card: warnings.alreadyUsedCard });
      if (!card.active) return reject({ card: warnings.notActivatedCard });

      selectedUser.balance += card.balance;
      card.usedBy = selectedUser._id;
      selectedUser.cards.push(card._id);

      await selectedUser.save({ validateBeforeSave: false });
      await card.save();

      const chargeInfo = { userBalance: selectedUser.balance, cardBalance: card.balance, user: selectedUser.username };

      Mailer.setMessage({
        template: "charge-balance",
        title: "Recharge Balance",
        content: {
          username: selectedUser.username,
          chargeInfo
        }
      });
      Mailer.send(selectedUser.email).catch(e => 400);

      return resolve(chargeInfo);
    } catch (err) {
      return reject(Card.handleErrors(err));
    }

  });

};

const deleteCard = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("cards");

    const serialNumber = req.params.serial_number;

    const card = await Card.findOne({ serialNumber: serialNumber.trim() });

    if (!card) return reject({ card: warnings.notFoundCard });

    if (card.active) return reject({ card: warnings.deleteActivatedCard });

    try {
      await Card.deleteOne({ _id: card._id });
      return resolve(true);
    } catch {
      reject({ server: warnings.server });
    }

  });

}

module.exports = {
  createCards,
  getCardInfo,
  getCardsInfo,
  activateCard,
  checkCard,
  chargeCardToAccount,
  deleteCard
};
