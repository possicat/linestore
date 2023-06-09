const Coupon = require('../models/coupon');
const User = require('../models/user');
const locale = require('../../locales/index');
//

const getCoupons = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const coupons = await Coupon.find({});

        return resolve(coupons);

    });

}

const createCoupon = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("coupons");

        const user = req.user;
        const { ownerId, code, discount } = req.body;

        if (typeof ownerId != "string" || !ownerId.trim().length) return reject({ ownerId: warnings.requiredOwnerId });

        const owner = await User.getUserById(ownerId, User);
        if (!owner) return reject({ owner: warnings.invalidOwnerId });

        try {
            const coupon = await Coupon.create({
                createdBy: user._id,
                ownerId: owner._id,
                code,
                discount
            });

            return resolve(coupon);
        } catch (err) {
            reject(Coupon.handleErrors(err));
        }

    });

};

const reCreateCoupon = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("coupons");

        const { code, newCode } = req.body;

        if (typeof code != "string" || !code.trim().length) return reject({ code: warnings.requiredCouponCode });
        if (typeof newCode != "string" || !newCode.trim().length) return reject({ newCode: warnings.requiredNewCouponCode });

        const coupon = await Coupon.findOne({ code });
        if (!coupon) return reject({ coupon: warnings.invalidCouponCode });

        coupon.code = newCode;
        await coupon.save();

        return resolve(coupon);

    });

};

const checkCoupon = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("coupons");

        const { code } = req.query;

        if (typeof code != "string" || !code.trim().length) return reject({ code: warnings.requiredCouponCode });

        const coupon = await Coupon.findOne({ code });
        if (!coupon) return reject({ coupon: warnings.invalidCouponCode });

        return resolve(coupon);

    });

};

const deleteCoupon = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("coupons");

        const code = req.params.coupon_code;

        if (typeof code != "string" || !code.trim().length) return reject({ coupon: warnings.requiredCouponCode });

        const coupon = await Coupon.findOne({ code });
        if (!coupon) return reject({ coupon: warnings.invalidCouponCode });

        await Coupon.deleteOne({ _id: coupon._id });

        return resolve(true);

    });

};

module.exports = {
    getCoupons,
    createCoupon,
    reCreateCoupon,
    checkCoupon,
    deleteCoupon
};
