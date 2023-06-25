const User = require('../models/user');
const Mailer = require('./mailer');
const locale = require('../../locales/index');
//

function initUserInfo(user, selectedUser) {

  const userInfo = {};

  for (const [key, value] of Object.entries(selectedUser._doc)) {

    if (key == "password" || key == "__v") continue;
    if (key == "_id") {
      userInfo["id"] = value;
      continue;
    }

    if (user.permissions.includes("admin")) {
      userInfo[key] = value;
      continue;
    }

    if (user.permissions.includes("agent") || (user.username == selectedUser.username)) {
      if (["ipAddress", "createdAt", "updatedAt"].includes(key)) continue;
      if (["purchases", "cards"].includes(key) && user.username != selectedUser.username) continue;
      userInfo[key] = value;
      continue;
    }

    if (!["fullName", "username"].includes(key)) continue;

    userInfo[key] = value;

  }

  return userInfo;

}

const getUserAccountInfo = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const user = req.user;
    const id = req.params.user_id;

    if (!id) return resolve(initUserInfo(user, user));

    const selectedUser = await User.getUserById(id, User);

    if (!selectedUser) return reject({ userId: warnings.notFoundUserId });

    return resolve(initUserInfo(user, selectedUser));

  });

}

const getUsersAccountsInfo = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const user = req.user;

    const users = await User.find({});
    const usersInfo = [];

    for (const selectedUser of users) {
      usersInfo.push(initUserInfo(user, selectedUser));
    }

    return resolve(usersInfo);

  });

}

const searchAboutUsersAccounts = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const user = req.user;

    const query = req.query;
    const { username, email } = query;

    if (!Object.keys(query).length) return reject({ query: warnings.requiredQuery });

    for (const [key, value] of Object.entries(query)) { // You can't search with things that includes a UpperCase Letters 
      query[key] = (typeof value == "string") ? value.trim().toLowerCase() : value;
    }

    const users = await User.find(query);
    const usersInfo = [];

    for (const selectedUser of users) {
      usersInfo.push(initUserInfo(user, selectedUser));
    }

    return resolve(usersInfo);

  });

}

const changeUserAccountInfo = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const user = req.user;
    const body = req.body;

    if (!Object.keys(body).length) return reject({ body: warnings.requiredBody });

    for (const [key, value] of Object.entries(body)) {
      if (!["fullName", "username", "password"].includes(key)) return reject({ body: warnings.invalidBody });
      if (typeof value != "string" || !value.trim().length) body[key] = null;
    }

    try {
      delete body.password;
      await user.updateOne(body, { runValidators: true });

      return resolve(Object.keys(body));
    } catch (err) {
      return reject(User.handleErrors(err));
    }

  });

};

const changeUserAccountPassword = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const user = req.user;
    const { newPassword } = req.body;

    try {
      user.password = (typeof newPassword == "string" && newPassword.trim().length) ? newPassword : null;
      await user.save();

      Mailer.setMessage({
        template: "change-password",
        title: "Change Password",
      });
      Mailer.send(user.email).catch(e => 400);

      const userToken = User.createToken({ email: user.email, password: newPassword.trim() });

      user.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await user.save({ validateBeforeSave: false });

      return resolve(userToken);
    } catch (err) {
      if (err.errors.password) {
        err.errors.password.message = err.errors.password.message.replace(/Password/g, "NewPassword").replace(/password/g, "NewPassword");
        err.errors.newPassword = err.errors.password;
        delete err.errors.password;
      }

      return reject(User.handleErrors(err));
    }

  });

};

const freezeUserAccount = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const id = req.params.user_id;

    const user = await User.getUserById(id, User);

    if (!user) return reject({ userId: warnings.notFoundUserId });

    if (user.username == req.user.username) return reject({ user: warnings.freezeYourself });
    if (user.permissions.includes("admin")) return reject({ user: warnings.freezeAdmins });

    if (user.frozen) return reject({ user: warnings.alreadyFrozen });

    user.frozen = true;
    await user.save({ validateBeforeSave: false });

    return resolve(true);

  });

}

const unFreezeUserAccount = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const id = req.params.user_id;

    const user = await User.getUserById(id, User);

    if (!user) return reject({ userId: warnings.notFoundUserId });

    if (!user.frozen) return reject({ user: warnings.notFrozen });

    user.frozen = false;
    await user.save({ validateBeforeSave: false });

    return resolve(true);

  });

}

const addRoleToUserAccount = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const id = req.params.user_id;

    const user = await User.getUserById(id, User);

    if (!user) return reject({ userId: warnings.notFoundUserId });

    const roleName = req.params.role_name;

    if (roleName.trim().toLowerCase() == "admin") return reject({ role: warnings.aboveYourLevelRole });

    if (!user.verified) return reject({ user: warnings.notVerifiedUser });
    if (user.permissions.includes(roleName.trim().toLowerCase())) return reject({ role: warnings.alreadyOwnsRole });

    user.permissions.push(roleName.trim().toLowerCase());
    await user.save({ validateBeforeSave: false });

    return resolve(true);

  });

}

const removeRoleFromUserAccount = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const id = req.params.user_id;

    const user = await User.getUserById(id, User);

    if (!user) return reject({ userId: warnings.notFoundUserId });

    const roleName = req.params.role_name;

    if (roleName.trim().toLowerCase() == "admin") return reject({ role: warnings.aboveYourLevelRole });

    if (!user.permissions.includes(roleName.trim().toLowerCase())) return reject({ role: warnings.notOwnsRole });

    user.permissions = user.permissions.filter(r => r != roleName.trim().toLowerCase());
    await user.save({ validateBeforeSave: false });

    return resolve(true);

  });

}

const deleteUserAccount = (req, res) => {

  return new Promise(async (resolve, reject) => {

    const { success, warnings } = locale.get("users");

    const id = req.params.user_id;

    const user = await User.getUserById(id, User);

    if (!user) return reject({ userId: warnings.notFoundUserId });

    if (user.username == req.user.username) return reject({ user: warnings.deleteYourself });
    if (user.permissions.includes("admin")) return reject({ user: warnings.deleteAdmins });

    try {
      await User.deleteOne({ _id: user._id });
      return resolve(true);
    } catch {
      reject({ server: warnings.server });
    }

  });

}


module.exports = {
  getUserAccountInfo,
  getUsersAccountsInfo,
  searchAboutUsersAccounts,
  changeUserAccountInfo,
  changeUserAccountPassword,
  freezeUserAccount,
  unFreezeUserAccount,
  addRoleToUserAccount,
  removeRoleFromUserAccount,
  deleteUserAccount
}
