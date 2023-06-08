const InvitationsManager = require('../managers/invitations');
const locale = require('../../locales/index');
//

const getInvitations = (req, res) => {

  const { success, warnings } = locale.get("invitations");

  InvitationsManager.getInvitations(req, res).then(invitations => {
    return res.status(200).json({
      message: success.fetched,
      invitations
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
  getInvitations,
  createInvitation,
  reCreateInvitationCode,
  useInvitationCode
};
