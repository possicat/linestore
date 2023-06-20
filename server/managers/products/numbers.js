const Order = require('../../models/order');
const Invitation = require('../../models/invitation');
const User = require('../../models/user');
const axios = require('axios');
const currencyConverter = require('currency-converter-lt');
const Coupon = require('../../models/coupon');
const locale = require('../../../locales/index');
const { readFileSync } = require('node:fs');
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

};

const getNumbersProducts = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("products");

    try { 
      const productsFile = JSON.parse(readFileSync('./././products.json'));  
      const products = [];
      const numbersSection = productsFile.sections.find(e => e.name.en.toLowerCase().includes("number"));

      const lang = locale.getLang();
      numbersSection.name = numbersSection.name[lang];

      let service, country;
      for (const product of numbersSection.products) {
        service = product.name.en.toLowerCase();
        product.name = product.name[lang];
        for (let i=0;i<product.subProducts.length;i++) {
          const subProduct = product.subProducts[i];
          country = subProduct.name.en.toLowerCase();
          subProduct.name = subProduct.name[lang];
          subProduct.endpoint = `${process.env.HOST}/${lang}/api/products/numbers/order/${service}/${country}`; 
        }
        products.push(product);
      }

      const section = {
        name: numbersSection.name,
        products
      };

      return resolve(section);
    } catch (err) {
      return reject({ product: warnings.notExistProduct });
    }

  });

};

const orderNumberProduct = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("products");

    const user = req.user;
    const { count, couponCode } = req.query;

    const product = await getNumberProductInfo(req, res).catch(err => false);
    if (!product) return reject({ product: warnings.notFoundActivationNumberProduct });
    
    const productsFile = JSON.parse(readFileSync('./././products.json'));
    const numbersSection = productsFile.sections.find(e => e.name.en.toLowerCase().includes("number"));
    let selectedProduct = numbersSection.products.find(e => e.name.en.toLowerCase() == product.service.toLowerCase());
    
    if (!selectedProduct) return reject({ product: warnings.notFoundActivationNumberProduct });
    selectedProduct = selectedProduct.subProducts.find(e => e.name.en.toLowerCase() == product.country.toLowerCase());
    if (!selectedProduct) return reject({ product: warnings.notFoundActivationNumberProduct });
    
    product.price = Math.max(selectedProduct.price, product.price);
    

    if (typeof count != "number") count = 1;
    else count = parseInt(count);

    if (product.quantity < count) return reject({ quantity: warnings.notEnoughQuantity });

    product.price *= count;

    if (user.balance < product.price) return reject({ user: warnings.notEnoughBalance });

    const coupon = await Coupon.findOne({ code: (typeof couponCode == "string") ? couponCode.trim() : null });
    if (coupon && Coupon.isExpired(coupon)) {
      await Coupon.deleteOne({ _id: coupon._id });
      return reject({ coupon: warnings.invalidCouponCode });
    }
    
    if (coupon) {
      const discountValue = product.price * (coupon.discount / 100);
      product.price -= discountValue;
    }

    const perPrice = product.price / count;

    user.balance -= product.price;
    await user.save({ validateBeforeSave: false });

    const products = [];
    const faileds = [];
    for (let i = 1; i <= count; i++) {
      try {
        const apiResponse = await requestManager.get(`user/buy/activation/${product.country.toLowerCase()}/any/${product.service.toLowerCase()}`);
        const buyInfo = apiResponse.data;

        products.push({
          id: buyInfo.id,
          phoneNumber: buyInfo.phone,
          service: buyInfo.product,
          country: buyInfo.country,
          createdAt: buyInfo.created_at,
          expiredAt: buyInfo.expires,
          phoneNumberSms: buyInfo.sms,
          price: perPrice,
          status: "PENDING"
        });

      } catch (err) {
        user.balance += perPrice;
        await user.save({ validateBeforeSave: false });

        faileds.push(err);
      }
    }

    if (!product.length) return reject({ server: warnings.server }); // TODO: Mange 5sim errors

    const order = await Order.create({
      orderType: product.type,
      orderedBy: user._id,
      products
    });

    user.purchases.push(order._id);
    await user.save({ validateBeforeSave: false });

    return resolve({
      orderId: order.id,
      success: products.length,
      faileds: faileds.length,
      userBalance: user.balance
    });

  });

};

const checkNumberOrder = (req, res) => { // GET SMS

  const { success, warnings } = locale.get("orders");

  return new Promise(async (resolve, reject) => {

    const user = req.user;
    const id = req.params.order_id;
    const numberIndex = req.params.number_index;

    if (!Number.isInteger(numberIndex) || numberIndex < 0) return reject({ numberIndex: warnings.mustBeIndexNumberIndex });

    const order = await Order.getOrderById(id.trim());

    if (!order) return reject({ order: warnings.notExistOrder });
    if (order.orderType.toLowerCase().trim() != "activation number") return reject({ order: warnings.notExistOrder });

    if (order.orderedBy.toString() != user._id.toString()) return reject({ order: warnings.notYoursOrder });

    if (!order.products[numberIndex]) return reject({ product: warnings.notExistProduct });
    if (order.products[numberIndex].status != "PENDING") return reject({ order: warnings.alreadyCheckedOrder });

    try {
      const apiResponse = await requestManager.get(`user/check/${order.products[numberIndex].id}`);
      const checkInfo = apiResponse.data;

      order.products[numberIndex].status = checkInfo.status.toUpperCase();
      order.products[numberIndex].phoneNumberSms = checkInfo.phoneNumberSms;
      if (order.products.every(p => p.status != "PENDING")) order.status = "FINISHED";

      await order.save({ validateBeforeSave: false });

      const invitation = await Invitation.getInvitationByInviterId(user.invitedBy);
      if (invitation) {
        const inviter = await User.getUserByToken(invitation.inviterId);
        inviter.balance += process.env.INVITER_PRIZE;
        await inviter.save({ validateBeforeSave: false });
      }

      requestManager.get(`user/finish/${order.products[numberIndex].id}`).catch(err => 400);

      return resolve({
        orderId: order.id,
        status: order.status,
        numberIndex,
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
    const numberIndex = req.params.number_index;

    const order = await Order.getOrderById(id.trim());

    if (!order) return reject({ order: warnings.notExistOrder });
    if (order.orderType.toLowerCase().trim() != "activation number") return reject({ order: warnings.notExistOrder });

    if (order.orderedBy.toString() != user._id.toString()) return reject({ order: warnings.notYoursOrder });

    if (!order.products[numberIndex]) return reject({ product: warnings.notExistProduct });
    if (order.products[numberIndex].status != "PENDING") return reject({ order: warnings.alreadyCheckedOrder });

    try {
      const apiResponse = await requestManager.get(`user/cancel/${order.products[numberIndex].id}`);
      const cancelInfo = apiResponse.data;

      user.balance += order.products[numberIndex].price;
      await user.save({ validateBeforeSave: false });

      const orderId = order._id;
      user.purchases.filter(e => e.toString() != orderId.toString());
      order.products[numberIndex].status = "CANCELED";

      await user.save({ validateBeforeSave: false });
      if (order.products.every(p => p.status == "CANCELED")) await Order.deleteOne({ _id: orderId });
      else await order.save();

      return resolve({
        orderId,
        numberIndex,
        userBalance: user.balance
      });
    } catch {
      return reject({ server: warnings.server }); // TODO: Mange 5sim errors
    }

  });

};

module.exports = {
  getNumbersProducts,
  getNumberProductInfo,
  orderNumberProduct,
  checkNumberOrder,
  cancelNumberOrder
};
