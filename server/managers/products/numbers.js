const Order = require('../../models/order');
const Invitation = require('../../models/invitation');
const User = require('../../models/user');
const axios = require('axios');
const currencyConverter = require('currency-converter-lt');
const Coupon = require('../../models/coupon');
const locale = require('../../../locales/index');
const { readFileSync } = require('node:fs');
const productsFile = JSON.parse(readFileSync('./././products.json'));
const CC = new currencyConverter();
const PROFIT = process.env.NUMBERS_PROFIT;
//

const requestManager = axios.create({
  baseURL: process.env.NUMBERS_API_URL,
  headers: {
    Accept: 'application/json',
    Authorization: process.env.NUMBERS_API_TOKEN
  }
});

const getNumberProductInfo = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("products");

    const service = req.params.service;
    const country = req.params.country;

    try {
      const apiResponse = await requestManager.get(`guest/products/${country.trim().toLowerCase()}/any`);
      const numbersServices = apiResponse.data;
      const product = numbersServices[service.trim().toLowerCase()];

      if (!product) return reject({ product: warnings.notFoundActivationNumberProduct });
      if (product.Category != "activation") return reject({ product: warnings.notFoundActivationNumberProduct });

      const productPriceInDollar = await CC.from("RUB").to("USD").amount(product.Price).convert();
      const newProductPrice = productPriceInDollar + Number(PROFIT);

      const productInfo = {
        type: `Activation Number`,
        service: service.trim().toUpperCase(),
        country: country.trim().toUpperCase(),
        quantity: product.Qty,
        price: Number(newProductPrice.toFixed(2)),
        currency: `USD`
      };

      return resolve(productInfo);
    } catch {
      return reject({ product: warnings.notFoundActivationNumberProduct });
    }
  });

}

const getNumbersProducts = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("products");

    try {
      const products = [];
      for (const category of productsFile.numbers) {
        for (let i=0;i<category.products.length;i++) {
          try {
            let product = category.products[i];
            req.params = { service: category.name, country: product.name };
            const productInfo = await getNumberProductInfo(req, res);
            product = { ...product, price: productInfo.price, currency: productInfo.currency };
            delete productInfo.price;
            delete productInfo.currency;
            product.metaData = { ...product.metaData, ...productInfo };
            category.products[i] = product;
          } catch {
            category.products[i].metaData.available = false;
          }
        }
        if (category.products.length) products.push(category);
      }

      return resolve(products);
    } catch (err) {
      return reject({ product: warnings.notExistProduct });
    }

  });

}

const orderNumberProduct = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("products");

    const user = req.user;
    const { couponCode } = req.query;

    const product = await getNumberProductInfo(req, res).catch(err => false);
    if (!product) return reject({ product: warnings.notFoundActivationNumberProduct });

    if (user.balance < product.price) return reject({ user: warnings.notEnoughBalance });

    const coupon = await Coupon.findOne({ code: couponCode || '' });
    if (coupon) {
      const discountValue = product.price / (product.price / coupon.discount);
      product.price -= discountValue;
    }

    user.balance -= product.price;
    await user.save({ validateBeforeSave: false });

    try {
      const apiResponse = await requestManager.get(`user/buy/activation/${product.country.toLowerCase()}/any/${product.service.toLowerCase()}`);
      const buyInfo = apiResponse.data;

      const order = await Order.create({
        orderType: product.type,
        orderedBy: user._id,
        orderDetails: {
          id: buyInfo.id,
          phoneNumber: buyInfo.phone,
          service: buyInfo.product,
          country: buyInfo.country,
          createdAt: buyInfo.created_at,
          expiredAt: buyInfo.expires,
          phoneNumberSms: buyInfo.sms,
          price: product.price
        }
      });

      user.purchases.push(order._id);
      await user.save({ validateBeforeSave: false });

      return resolve({
        orderId: order.id,
        ...order.orderDetails,
        userBalance: user.balance
      });

    } catch (err) {
      user.balance += product.price;
      await user.save({ validateBeforeSave: false });

      return reject({ server: warnings.server }); // TODO: Mange 5sim errors
    }

  });

}

const checkNumberOrder = (req, res) => { // GET SMS

  const { success, warnings } = locale.get("orders");

  return new Promise(async (resolve, reject) => {

    const user = req.user;
    const id = req.params.order_id;

    const order = await Order.getOrderById(id.trim());

    if (!order) return reject({ order: warnings.notExistOrder });
    if (order.orderType.toLowerCase().trim() != "activation number") return reject({ order: warnings.notExistOrder });

    if (order.orderedBy.toString() != user._id.toString()) return reject({ order: warnings.notYoursOrder });
    if (order.status != "PENDING") return reject({ order: warnings.alreadyCheckedOrder });

    try {
      const apiResponse = await requestManager.get(`user/check/${order.orderDetails.id}`);
      const checkInfo = apiResponse.data;

      order.status = checkInfo.status.toUpperCase();
      order.orderDetails.phoneNumberSms = checkInfo.phoneNumberSms;
      await order.save({ validateBeforeSave: false });

      const invitation = await Invitation.getInvitationByInviterId(user.invitedBy);
      if (invitation) {
        const inviter = await User.getUserByToken(invitation.inviterId);
        inviter.balance += process.env.INVITER_PRIZE;
        await inviter.save({ validateBeforeSave: false });
      }

      requestManager.get(`user/finish/${order.orderDetails.id}`).catch(err => 400);

      return resolve({
        orderId: order.id,
        status: order.status,
        phoneNumberSms: checkInfo.phoneNumberSms
      });

    } catch (err) {
      return reject({ server: warnings.server }); // TODO: Mange 5sim errors
    }

  });

};

const cancelNumberOrder = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("orders");

    const user = req.user;
    const id = req.params.order_id;

    const order = await Order.getOrderById(id.trim());

    if (!order) return reject({ order: warnings.notExistOrder });
    if (order.orderType.toLowerCase().trim() != "activation number") return reject({ order: warnings.notExistOrder });

    if (order.orderedBy.toString() != user._id.toString()) return reject({ order: warnings.notYoursOrder });
    if (order.status != "PENDING") return reject({ order: warnings.alreadyCheckedOrder });

    try {
      const apiResponse = await requestManager.get(`user/cancel/${order.orderDetails.id}`);
      const cancelInfo = apiResponse.data;

      user.balance += order.orderDetails.price;
      await user.save({ validateBeforeSave: false });

      const orderId = order._id;
      user.purchases.filter(e => e.toString() != orderId.toString());

      await user.save({ validateBeforeSave: false });
      await Order.deleteOne({ _id: order._id });

      return resolve({
        orderId,
        userBalance: user.balance
      });
    } catch {
      return reject({ server: warnings.server }); // TODO: Mange 5sim errors
    }

  });

}

module.exports = {
  getNumbersProducts,
  getNumberProductInfo,
  orderNumberProduct,
  checkNumberOrder,
  cancelNumberOrder
};
