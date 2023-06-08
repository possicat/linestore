const CardsManager = require('../managers/cards');
const locale = require('../../locales/index');
//

const createCards = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.createCards(req, res).then(cardsInfo => {
    return res.status(200).json({
      message: success.created,
      cardsInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const getCard = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.getCardInfo(req, res).then(cardInfo => {
    return res.status(200).json({
      message: success.fetched,
      cardInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const getCards = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.getCardsInfo(req, res).then(cardsInfo => {
    return res.status(200).json({
      message: success.fetched,
      cardsInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const checkCard = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.checkCard(req, res).then(cardInfo => {
    return res.status(200).json({
      message: success.fetched,
      cardInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const activateCard = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.activateCard(req, res).then(() => {
    return res.status(200).json({
      message: success.activated,
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const chargeCard = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.chargeCardToAccount(req, res).then(chargeInfo => {
    return res.status(200).json({
      message: success.charged(chargeInfo),
      chargedUser: chargeInfo.user
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const deleteCard = (req, res) => {

  const { success, warnings } = locale.get("cards");

  CardsManager.deleteCard(req, res).then(() => {
    return res.status(200).json({
      message: success.deleted
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

module.exports = {
  createCards,
  getCard,
  getCards,
  checkCard,
  activateCard,
  chargeCard,
  deleteCard
};
