const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const locale = require('../../locales/index');
//

const orderSchema = new mongoose.Schema({
  orderType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  orderedBy: {
    type: ObjectId,
    required: true
  },
  status: {
    type: String,
    upercase: true,
    trim: true,
    default: "PENDING"
  },
  products: {
    type: Array,
    required: true
  }
}, { timestamps: true });

// -----

orderSchema.statics.getOrderById = async (id = '', model) => {

  if (!ObjectId.isValid(id.trim())) return null;

  const order = await model.findOne({ _id: id });
  if (!order) return null;

  return order;

}

orderSchema.statics.handleErrors = (error) => {

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


const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
