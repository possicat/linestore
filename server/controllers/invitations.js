const InvitationsManager = require('../managers/invitations');
const locale = require('../../locales/index');
//

const getInvitation = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.getInvitationInfo(req, res).then(invitationInfo => {
    return res.status(200).json({
      message: success.fetched,
      invitationInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const getMyInvitation = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.getMyInvitationInfo(req, res).then(invitationInfo => {
    return res.status(200).json({
      message: success.fetched,
      invitationInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const getInvitations = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.getInvitationsInfo(req, res).then(invitationsInfo => {
    return res.status(200).json({
      message: success.fetched,
      invitationsInfo
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const createInvitation = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.createInvitation(req, res).then(code => {
    return res.status(200).json({
      message: success.created,
      code
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const reCreateInvitationCode = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.reCreateInvitationCode(req, res).then(code => {
    return res.status(200).json({
      message: success.recreated,
      code
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

const useInvitationCode = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.useInvitationCode(req, res).then(() => {
    return res.status(200).json({
      message: success.use
    });
  }).catch(errors => {
    return res.status(400).json({
      message: warnings.general,
      reason: Object.values(errors)[0]
    });
  });

};

module.exports = {
  getInvitation,
  getMyInvitation,
  getInvitations,
  createInvitation,
  reCreateInvitationCode,
  useInvitationCode
};
