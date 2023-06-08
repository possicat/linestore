const Invitation = require('../models/invitation');
const locale = require('../../locales/index');
//

const getInvitations = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const invitations = await Invitation.find({});

        return resolve(invitations);

    });

};

const createInvitation = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const user = req.user;

        try {
            const code = await Invitation.generateUniqueInviteCode(Invitation);
            const invitation = await Invitation.create({
                inviterId: user._id,
                code
            });

            return resolve(invitation.code);
        } catch (err) {
            return reject(Invitation.handleErrors(err));
        }

    });

};

const reCreateInvitationCode = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const user = req.user;

        const code = await Invitation.generateUniqueInvite(Invitation);
        let invitation = await Invitation.findOne({ inviterId: user._id });

        if (!invitation) {
            invitation = await createInvitation(req, res);
        } else {
            invitation.code = code;
            await invitation.save();
        }

        return resolve(invitation.code);

    });

};

const useInvitationCode = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("invitations");

        const user = req.user;
        const { code } = req.query;

        if (typeof code != "string" || !code.trim().length) return reject({ code: warnings.requiredInvitationCode });

        const invitation = await Invitation.findOne({ code: (typeof code == "string" && code.trim().length) ? code.trim() : null });
        if (!invitation) return reject({ code: warnings.invalidInvitationCode });
        if (user.invitedBy) return reject({ user: warnings.alredyUseInviteCode });

        user.invitedBy = invitation.inviterId;
        invitation.uses.push(user._id);

        return resolve(true);
    });

};

async function isValidInvitationCode (code) { // Used in register function
    if (!code) return true;
    const invitation = await Invitation.findOne({ code: (typeof code == "string" && code.trim().length) ? code.trim() : null });
    if (!invitation) return false;
}

module.exports = {
    getInvitations,
    createInvitation,
    reCreateInvitationCode,
    useInvitationCode,
    isValidInvitationCode
}
