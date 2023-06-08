const UsersManager = require('../managers/users');
const locale = require('../../locales/index');
//

const getUserInfo = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.getUserAccountInfo(req, res).then(userInfo => {
    return res.status(200).json({
      message: success.fetched,
      userInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const getUsersInfo = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.getUsersAccountsInfo(req, res).then(usersInfo => {
    return res.status(200).json({
      message: success.fetched,
      usersInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const searchAboutUsers = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.searchAboutUsersAccounts(req, res).then(usersInfo => {
    return res.status(200).json({
      message: success.fetched,
      usersInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const changeUserInfo = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.changeUserAccountInfo(req, res).then(updatedKeys => {
    return res.status(200).json({
      message: success.updated,
      updatedKeys
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const changeUserPassword = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.changeUserAccountPassword(req, res).then(() => {
    return res.status(200).json({
      message: success.changedPassword
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const freezeUser = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.freezeUserAccount(req, res).then(() => {
    return res.status(200).json({
      message: success.frozen
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const unFreezeUser = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.unFreezeUserAccount(req, res).then(() => {
    return res.status(200).json({
      message: success.unfrozen
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const addRoleToUser = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.addRoleToUserAccount(req, res).then(() => {
    return res.status(200).json({
      message: success.addedRole
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const removeRoleFromUser = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.removeRoleFromUserAccount(req, res).then(() => {
    return res.status(200).json({
      message: success.removedRole
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });
  
};

const deleteUser = (req, res) => {
  
  const { success, warnings } = locale.get("users");
  
  UsersManager.deleteUserAccount(req, res).then(() => {
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
  getUserInfo,
  getUsersInfo,
  searchAboutUsers,
  changeUserInfo,
  changeUserPassword,
  freezeUser,
  unFreezeUser,
  addRoleToUser,
  removeRoleFromUser,
  deleteUser
};
