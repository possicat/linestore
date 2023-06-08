const Order = require('../models/order');
const locale = require('../../locales/index');
//

const getOrders = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const orders = await Order.find({});

        return resolve(orders);

    });

};

const getMyOrders = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const user = req.user;

        const orders = await Order.find({ orderedBy: user._id });

        return resolve(orders);

    });

};

const getOrder = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("orders");

        const id = req.params.order_id;
        const order = await Order.getOrderById(id.trim());

        if (!order) return reject({ order: warnings.notExistOrder });
        if (!user.permissions.includes("admin") && order.orderedBy.toString() != user._id.toString()) return reject({ order: warnings.notYoursOrder });

        return resolve(order);

    });

};

module.exports = {
    getOrders,
    getMyOrders,
    getOrder
}
