const NumbersManager = require('../../managers/products/numbers');
const locale = require('../../../locales/index');
//

const getProducts = (req, res) => {

  const { success, warnings } = locale.get("products");

  NumbersManager.getNumbersProducts(req, res).then(products => {
    return res.status(200).json({
      message: success.fetched,
      products
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const getProduct = (req, res) => {

  const { success, warnings } = locale.get("products");

  NumbersManager.getNumberProductInfo(req, res).then(productInfo => {
    return res.status(200).json({
      message:  success.fetched,
      productInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const orderProduct = (req, res) => {

  const { success, warnings } = locale.get("products");
  
  NumbersManager.orderNumberProduct(req, res).then(buyInfo => {
    return res.status(200).json({
      message: success.purchased,
      buyInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const checkOrder = (req, res) => {

  const { success, warnings } = locale.get("products");
  
  NumbersManager.checkNumberOrder(req, res).then(checkInfo => {
    return res.status(200).json({
      message: success.checked,
      checkInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const cancelOrder = (req, res) => {

  const { success, warnings } = locale.get("products");
  
  NumbersManager.cancelNumberOrder(req, res).then(cancelInfo => {
    return res.status(200).json({
      message: success.canceled,
      cancelInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

module.exports = {
  getProducts,
  getProduct,
  orderProduct,
  checkOrder,
  cancelOrder
};
