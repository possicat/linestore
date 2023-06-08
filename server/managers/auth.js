const User = require('../models/user');
const Invitation = require('./invitations');
const Mailer = require('./mailer');
const jwt = require('jsonwebtoken');
const generateUniqueId = require('generate-unique-id');
const locale = require('../../locales/index');
//

const createAccount = (req, res) => {
  
  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("auth");

    const invitationCode = req.query.invitationCode;
    if (typeof invitationCode  == "string" && !(await Invitation.isValidInvitationCode(invitationCode))) return reject({ invitationCode: warnings.invalidInvitationCode });
    
    const { fullName, username, email, password } = req.body;
    
    try {
      const user = await User.create({ fullName, username, email, password, ipAddress: (req.headers['x-forwarded-for'] || req.connection.remoteAddress) });
      const userToken = User.createToken({ email, password });
      
      Mailer.setMessage({
        template: "create-account",
        title: "Create Account",
      });
      Mailer.send(user.email).catch(e => 400);

      req.user = user;
      req.code = invitationCode;
      Invitation.useInvitationCode(req, res).catch(err => 400);
      
      return resolve(userToken);
    } catch (err) {
      return reject(User.handleErrors(err));
    }
  
  });
  
};

const login = async (req, res) => {

  return new Promise(async (resolve, reject) => {
    
    const { success, warnings } = locale.get("auth");
    
    const { email, username, password } = req.body;
    
    if ((typeof email != "string" || !email.trim().length) && (typeof username != "string" || !username.trim().length)) return reject({ email: warnings.requiredEmailOrUsername });
    if (typeof password  != "string" || !password.trim().length) return reject({ password: warnings.requiredPassword });
    
    const query = (typeof email == "string") ? { email: email.toLowerCase().trim() } : { username: username.toLowerCase().trim() };
    const user = await User.findOne(query);
    if (!user) return reject({ email: warnings.notFoundUser });
    
    const isCorrectPass = await User.isCorrectPassword(password, user.password);
    if (!isCorrectPass) return reject({ password: warnings.incorrectPassword });
    
    const userToken = User.createToken({ email: user.email, password });
    
    user.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await user.save({ validateBeforeSave: false });
    
    return resolve(userToken);
  
  });
  
};

const verificationAccount = async (req, res) => {
  
  return new Promise(async (resolve, reject) => {
    
    const { success, warnings } = locale.get("auth");
    
    const user = req.user;
    
    if (user.verified) return reject({ verify: warnings.alreadyVerified });
    
    const verificationCode = generateUniqueId({ length: 6, useLetters: false }).toString();
    const verificationData = { email: user.email, verificationCode };
    const verificationToken = jwt.sign(verificationData, process.env.VERIFY_SECRET, { expiresIn: "6h" });
    
    Mailer.setMessage({
      template: (req.body.byCode) ? "verification-code" : "verification-link",
      title: "Verification",
      content: {
        link: `${process.env.HOST}/api/auth/verify?token=${verificationToken}&&code=${verificationCode}`,
        code: verificationCode
      }
    });
    Mailer.send(user.email).catch(e => 400);
    
    return resolve(verificationToken);
  
  });
    
};

const verifyAccount = (req, res) => {
  
  return new Promise(async (resolve, reject) => {
    
    const { success, warnings } = locale.get("auth");
    
    // URL = "https://DOMAIN_NAME/api/auth/verify?token=(TOKEN)&&code=(CODE)"
    const verificationToken = req.query.token;
    const verificationCode = req.query.code;
    
    jwt.verify(verificationToken, process.env.VERIFY_SECRET, async function (err, decodedData) {
      if (err) return reject({ verificationToken: warnings.invalidVerificationToken });
      try {
        const user = await User.findOne({ email: decodedData.email });
        if (user.verified) return reject({ verify: warnings.alreadyVerified });
        if (typeof verificationCode != "string" || !verificationCode.length) return reject({ verificationCode: warnings.requiredVerificationCode });
        if (verificationCode != decodedData.verificationCode) return reject({ verificationCode: warnings.invalidVerificationCode });
        
        user.verified = true;
        await user.save({ validateBeforeSave: false });
        
        return resolve(true);
      
      } catch {
        return reject({ verificationToken: warnings.invalidVerificationToken });
      }
    });
    
  });
  
};

const forgotAccountPassword = (req, res) => {
  
  return new Promise(async (resolve, reject) => {
    
    const { success, warnings } = locale.get("auth");
    
    const { email } = req.body;
    
    if (typeof email != "string" || !email.trim().length) return reject({ email: warnings.requiredEmail });
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) return reject({ email: warnings.notFoundEmail });
    
    const resetData = { email: user.email, password: user.password };
    const resetToken = jwt.sign(resetData, process.env.RESET_PASSWORD_SECRET, { expiresIn: "6h" });
    
    Mailer.setMessage({
      template: "reset-password",
      title: "Reset Password",
      content: {
        link: `${process.env.HOST}/api/auth/reset-password?token=${resetToken}`,
      }
    });
    Mailer.send(user.email).catch(e => 400);
    
    return resolve(true);
    
  });
  
};

const resetAccountPassword = (req, res) => {
  
  return new Promise(async (resolve, reject) => {
    
    const { success, warnings } = locale.get("auth");
    
    const resetToken = req.query.token;
    
    jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET, async function (err, decodedData) {
      if (err) return reject({ resetToken: warnings.invalidResetToken });
      
      try {
        const user = await User.findOne({ email: decodedData.email });
        
        if (user.password != decodedData.password) return reject({ resetToken: warnings.invalidResetToken });;
        
        if (req.method == 'POST') {
          
          const { password } = req.body;
          
          if (typeof password  != "string" || !password.trim().length) return reject({ password: warnings.requiredPassword });
          
          user.password = password;
          try {
            await user.save();
            
            Mailer.setMessage({
              template: "change-password",
              title: "Change Password",
            });
            Mailer.send(user.email).catch(e => 400);
            
          } catch (error) {
            return reject(User.handleErrors(error));
          }
          
        }
        
        return resolve(resetToken);
        
      } catch {
        return reject({ resetToken: warnings.invalidResetToken });
      }
        
    });
    
  });
  
};


const isAvailableUsername = (req, res) => {
  
  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("auth");

    const username = req.params.username;

    if (typeof username != "string" || !username.trim().length) return reject({ username: warnings.requiredUsername });

    const user = User.findOne({ username: username.toLowerCase().trim() });
    if (!user) return resolve(true);
    return resolve(false);

  });

};

module.exports = {
  createAccount,
  login,
  verificationAccount,
  verifyAccount,
  forgotAccountPassword,
  resetAccountPassword,
  isAvailableUsername
};
