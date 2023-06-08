const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const bcrypt = require('bcrypt');
const generateUniqueId = require('generate-unique-id');
const locale = require('../../locales/index');
const codeFormat = process.env.CARDCODEFORMAT;
//

const cardSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  codeHint: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    required: [true, "requiredBalance"],
    min: [1, "invalidBalance"],
    max: [100, "invalidBalance"],
    validate: [Number.isInteger, "invalidBalance"]
  },
  createdBy: {
    type: ObjectId,
    required: true
  },
  ownedBy: { // Agent
    type: ObjectId
  },
  usedBy: {
    type: ObjectId
  },
  active: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

cardSchema.pre("save", async function (next) {
  
  if (this.code.length <= 31) {
    const salt = await bcrypt.genSalt();
    this.code = await bcrypt.hash(this.code, salt);
  }
  
  next();
  
});

// -----

cardSchema.statics.generateUniqueCard = async (model) => {
  
  let code, serialNumber;
  
  do {
    code = generateCardCodeWithHint();
    serialNumber = generateUniqueId({ length: 9, useLetters: false }).toString();
  } while ((await model.findOne({ codeHint: code.hint })) || (await model.findOne({ serialNumber })));
  
  return { code: code.code, codeHint: code.hint, serialNumber };
  
}

cardSchema.statics.getCardByCode = async (code, model) => {
  
  code = code.trim();
  const codeHint = extractYZ(code);
  
  if (!codeHint) return false;
  try {
    const card = await model.findOne({ codeHint });
    
    if (!(await bcrypt.compare(code, card.code))) return false;
    
    return card;
  } catch (err) {
    return false;
  }
  
};

cardSchema.statics.handleErrors = (error) => {
  
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

function generateCardCodeWithHint () {
  
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codeHint = "";
  
  const code = codeFormat.replace(/[XYZ]/g, (e) => {
    const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
    if (e == "Y" || e == "Z") codeHint += randomChar;
    return randomChar;
  });
  
  return {
    code,
    hint: codeHint.split('').reverse().join('')
  }
  
}

function extractYZ (code) {
  
  if (code.trim().length != codeFormat.length) return null;
  let YZ = "";
  
  codeFormat.split('').forEach((e, i) => {
  	if (e == "Y" || e == "Z") YZ += code[i];
  });
  
  return YZ.split('').reverse().join('');
  
}

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
