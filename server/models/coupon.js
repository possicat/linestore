const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const locale = require('../../locales/index');
//

const couponSchema = new mongoose.Schema({
  createdBy: {
    type: ObjectId,
    required: true,
  },
  ownerId: {
    type: ObjectId,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [32, `tooLongCode`]
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  uses: {
    type: [ObjectId],
    default: []
  }
}, { timestamps: true });

// -----

couponSchema.statics.getCouponByOwnerId = async (id = '', model) => {

  if (!ObjectId.isValid(id.trim())) return null;

  const coupon = await model.findOne({ ownerId: id });
  if (!coupon) return null;

  return coupon;

}

couponSchema.statics.handleErrors = (error) => {

  const { success, warnings } = locale.get("auth");

  const errors = {};

  if (error.code === 11000) {
    const key = Object.keys(error.keyValue)[0];
    errors[key] = warnings.alreadyTaken(key);
  } else if (error.errors) {
    for (const [key, value] of Object.entries(error.errors)) {
      const errorPath = key.split('.').pop();
      errors[errorPath] = value.message;
    }
  } else {
    errors.server = warnings.server;
  }

  return errors;

}

const Coupon = mongoose.model("coupons", couponSchema);

module.exports = Coupon;
