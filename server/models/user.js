const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail, isStrongPassword } = require('validator');
const locale = require('../../locales/index');
//
  
function isFullName (fullName) {
  const splitFullName = fullName.trim().split(' ');
  if (splitFullName.length < 2) return false;
  return true;
}

function isUsername (username)  {
	const usernameFormat = username.match(/[^A-z\d._]/g) || '';
	return (usernameFormat.length > 0) ? false : true;
}

function isGoodPassword (password) {
  if (password.trim().includes(" ")) return false;
  return isStrongPassword(password.trim());
}

const userSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    // required: [true, `requiredFullname`],
    maxlength: [40, `tooLongFullname`],
    trim: true,
    //validate: [isFullName, `invalidFullname`]
  },
  username: {
    type: String,
    required: [true, `requiredUsername`],
    unique: true,
    maxlength: [16, `tooLongUsername`],
    minlength: [3, `tooShortUsername`],
    lowercase: true,
    trim: true,
    validate: [isUsername, `invalidUsername`]
  },
  email: {
    type: String,
    required: [true, `requiredEmail`],
    unique: true,
    maxlengh: [32, `tooLongEmail`],
    lowercase: true,
    validate: [isEmail, `invalidEmail`],
    trim: true
  },
  password: {
    type: String,
    required: [true, `requiredPassword`],
    minlength: [8, `tooShortPassword`],
    maxlength: [26, `tooLongPassword`],
    trim: true,
    validate: [isGoodPassword, `invalidPassword`]
  },
  verified: {
    type: Boolean,
    default: false
  },
  frozen: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  frozenBalance: {
    type: Number,
    default: 0
  },
  purchases: {
    type: [ObjectId],
    default: [] // Store just the id of order
  },
  cards: {
    type: [ObjectId],
    default: []
  },
  permissions: {
    type: Array,
    default: ["member"]
  },
  invitedBy: {
    type: ObjectId
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  
  if (this.password.length <= 26) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
  
});

// -----

userSchema.statics.createToken = ({ email, password } = {}, exp = "3d") => {
  
  const data = { email: email.toLowerCase().trim(), password: password.trim() };
  const token = jwt.sign(data, process.env.LOGIN_SECRET, {
    expiresIn: exp
  });
  
  return token.toString();
  
}

userSchema.statics.getUserByToken = async (userToken, model) => {
  
  try {
    if (typeof userToken == "string") userToken = userToken.trim();
    const decodedData = jwt.verify(userToken, process.env.LOGIN_SECRET);
    
    const user = await model.findOne({ email: decodedData.email.trim() });
    const isCorrectPass = await bcrypt.compare(decodedData.password.trim(), user.password);
    if (!isCorrectPass) return null;
    
    return user;
    
  } catch (err) {
    return null;
  }
  
}

userSchema.statics.getUserById = async (id = '', model) => {
  
  if (!ObjectId.isValid(id.trim())) return null;
  
  const user = await model.findOne({ _id: id });
  if (!user) return null;
  
  return user;
  
}

userSchema.statics.isCorrectPassword = async (password, userPassword) => {
  return await bcrypt.compare(password.trim(), userPassword);
};


userSchema.statics.handleErrors = (error) => {
  
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


const User = mongoose.model("users", userSchema);

module.exports = User;
