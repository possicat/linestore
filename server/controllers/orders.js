const OrdersManager = require('../managers/orders');
const locale = require('../../locales/index');
//

const getOrders = (req, res) => {

    const { success, warnings } = locale.get("orders");

    OrdersManager.getOrders(req, res).then(orders => {
        return res.status(200).json({
            message: success.fetched,
            orders
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

const getMyOrders = (req, res) => {

    const { success, warnings } = locale.get("orders");

    OrdersManager.getMyOrders(req, res).then(orders => {
        return res.status(200).json({
            message: success.fetched,
            orders
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

const getOrder = (req, res) => {

    const { success, warnings } = locale.get("orders");

    OrdersManager.getOrder(req, res).then(order => {
        return res.status(200).json({
            message: success.fetched,
            order
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

module.exports = {
    getOrders,
    getMyOrders,
    getOrder
};
