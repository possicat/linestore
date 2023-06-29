const Order = require('../models/order');
const locale = require('../../locales/index');
//

function initOrderInfo(user, order) {

    const orderInfo = {};
  
    if (!user) user = { permissions: [] };
  
    for (const [key, value] of Object.entries(order._doc)) {
  
      if (key == "__v") continue;
      if (key == "_id") {
        orderInfo["id"] = value;
        continue;
      }
  
      if (user.permissions.includes("admin")) {
        orderInfo[key] = value;
        continue;
      }
  
      if (user.permissions.includes("agent")) {
        if (["createdAt", "updatedAt", "products"].includes(key)) continue;
        orderInfo[key] = value;
        continue;
      }
  
      if (user._id.toString() != order.orderedBy) continue;
  
      orderInfo[key] = value;
  
    }
  
    return orderInfo;
  
  }

const getOrders = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const orders = await Order.find({});
        const ordersInfo = [];

        for (const order of orders) {
            ordersInfo.push(initOrderInfo(null, order));
        }

        return resolve(ordersInfo);

    });

};

const getMyOrders = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const user = req.user;

        const orders = await Order.find({ orderedBy: user._id });
        const ordersInfo = [];

        for (const order of orders) {
            ordersInfo.push(initOrderInfo(null, order));
        }

        return resolve(ordersInfo);

    });

};

const getOrder = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("orders");

        const user = req.user;

        const id = req.params.order_id;
        const order = await Order.getOrderById(id.trim());

        if (!order) return reject({ order: warnings.notExistOrder });
        if (!user.permissions.includes("admin") && order.orderedBy.toString() != user._id.toString()) return reject({ order: warnings.notYoursOrder });

        return resolve(initOrderInfo(user, order));

    });

};

module.exports = {
    getOrders,
    getMyOrders,
    getOrder
}
