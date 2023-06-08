const CouponsManager = require('../managers/coupons');
const locale = require('../../locales/index');
//

const getCoupons = (req, res) => {

    const { success, warnings } = locale.get("coupons");

    CouponsManager.getCoupons(req, res).then(coupons => {
        return res.status(200).json({
            message: success.fetched,
            coupons
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

const createCoupon = (req, res) => {

    const { success, warnings } = locale.get("coupons");

    CouponsManager.createCoupon(req, res).then(code => {
        return res.status(200).json({
            message: success.created,
            code
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

const reCreateCoupon = (req, res) => {

    const { success, warnings } = locale.get("coupons");

    CouponsManager.reCreateCoupon(req, res).then(code => {
        return res.status(200).json({
            message: success.recreated,
            code
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

const checkCoupon = (req, res) => {

    const { success, warnings } = locale.get("coupons");

    CouponsManager.checkCoupon(req, res).then(coupon => {
        return res.status(200).json({
            message: success.fetched,
            coupon
        });
    }).catch(errors => {
        return res.status(400).json({
            message: warnings.general,
            reason: Object.values(errors)[0]
        });
    });

};

const deleteCoupon = (req, res) => {

    const { success, warnings } = locale.get("coupons");

    CouponsManager.deleteCoupon(req, res).then(() => {
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
    getCoupons,
    createCoupon,
    reCreateCoupon,
    checkCoupon,
    deleteCoupon
};
