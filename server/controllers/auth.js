const AuthManager = require('../managers/auth');
const locale = require('../../locales/index');
//

const register = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.createAccount(req, res).then(userToken => {
    return res.status(200).json({
      message: success.register,
      userToken
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const login = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.login(req, res).then(userToken => {
    return res.status(200).json({
      message: success.login,
      userToken
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const verification = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.verificationAccount(req, res).then(verificationToken => {
    return res.status(200).json({
      message: success.verification,
      verificationToken
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const verify = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.verifyAccount(req, res).then(redirectUrl => {
    if (typeof redirectUrl == "string") return res.status(200).redirect(redirectUrl);
    return res.status(200).json({
      message: success.verify,
    });
  }).catch(errors => {
    const reason = Object.values(errors)[0];
    if (reason == "alreadyVerified" && typeof redirectUrl == "string") return res.status(200).redirect(redirectUrl);
    return res.status(400).json({
      message: warnings.general,
      reason
    });
  });
  
};

const forgotPassword = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.forgotAccountPassword(req, res).then(userEmail => {
    return res.status(200).json({
      message: success.forgotPassword,
      userEmail
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const resetPassword = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.resetAccountPassword(req, res).then(resetToken => {
    
    if (req.method == 'GET') {
      return res.status(200).render('reset-password', { resetToken });
    }
    
    return res.status(200).json({
      message: success.resetPassword,
    });

  }).catch(errors => {
    
    /*if (req.method == 'GET') {
      return res.status(400).render('');
    }*/
    
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
    
  });
  
};

const isAvailableUsername = (req, res) => {
  
  const { success, warnings } = locale.get("auth");
  
  AuthManager.isAvailableUsername(req, res).then(available => {
    return res.status(200).json({
      available,
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};


module.exports = {
  register,
  login,
  verification,
  verify,
  forgotPassword,
  resetPassword,
  isAvailableUsername
};
