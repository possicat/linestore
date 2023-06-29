const User = require('../models/user');
const locale = require('../../locales/index');
//

const isLogined = async (req, res, next) => {
  
  const { success, warnings } = locale.get("auth");
  
  const userToken = req.headers["authorization"];
  const user = await User.getUserByToken(userToken, User);
  
  if (!user) {
    if (typeof userToken != "string" || !userToken.trim().length) {
      return res.status(418).json({ 
        message: warnings.requiredAuthentication, 
        reason: warnings.requiredAuthentication,
      });
    }
    
    return res.status(418).json({ 
      message: warnings.requiredAuthentication,
      reason: warnings.invalidUserToken
    });
  }
  
  if (user.frozen) return res.status(418).json({ 
    message: warnings.frozenAccount,
    reason: warnings.frozenUserToken,
    userId: user._id
  });
  
  req.user = user; // Send The User To Second Function
  next();
  
};

const isVerified = async (req, res, next) => {
  
  const { success, warnings } = locale.get("auth");
  
  const user = req.user;
  
  if (!user.verified) return res.status(400).json({
    message: warnings.notVerifiedAccount,
    reason: warnings.notVerifiedAccount
  });
  
  next();
  
};

const isAdmin = async (req, res, next) => {
  
  const { success, warnings } = locale.get("auth");
  
  const user = req.user;
  
  if (!user.permissions.includes("admin")) return res.status(400).json({
    message: warnings.notHasAdminPermissions,
    reason: warnings.notHasAdminPermissions
  });
  
  next();
  
};

const isAgent = async (req, res, next) => {
  
  const { success, warnings } = locale.get("auth");
  
  const user = req.user;
  
  if (!user.permissions.includes("agent") && !user.permissions.includes("admin")) return res.status(400).json({
    message: warnings.notHasAgentPermissions,
    reason: warnings.notHasAgentPermissions
  });
  
  next();
  
};

const passwordRequired = async (req, res, next) => {
  
  const { success, warnings } = locale.get("auth");
  
  const user = req.user;
  const { password } = req.body;
  
  if (typeof password  != "string" || !password.trim().length) return res.status(400).json({
    message: warnings.general,
    reason: warnings.requiredPassword
  });
  
  if (!(await User.isCorrectPassword(password, user.password))) return res.status(400).json({
    message: warnings.general,
    reason: warnings.incorrectPassword
  });
  
  next();
  
};

module.exports = {
  isLogined,
  isVerified,
  isAdmin,
  isAgent,
  passwordRequired
};
