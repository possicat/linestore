const Invitation = require('../models/invitation');
const locale = require('../../locales/index');
//

function initInvitationInfo(user, invitation) {

    const invitationInfo = {};

    if (!user) user = { permissions: [] };

    for (const [key, value] of Object.entries(invitation._doc)) {

        if (key == "__v") continue;
        if (key == "_id") {
            invitationInfo["id"] = value;
            continue;
        }

        if (key == "uses") invitationInfo["usesCount"] = value.length;

        if (user.permissions.includes("admin")) {
            invitationInfo[key] = value;
            continue;
        }

        if (user.permissions.includes("agent")) {
            if (["createdAt", "updatedAt"].includes(key)) continue;
            invitationInfo[key] = value;
            continue;
        }

        if (!["inviterId", "code", "createdAt"].includes(key)) continue;

        invitationInfo[key] = value;

    }

    return cardInfo;

}

const getInvitationInfo = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("invitations");

        const user = req.user;
        const inviterId = req.params.inviterId;

        const invitation = await Invitation.findOne({ inviterId: inviterId });
        if (!invitation) return reject({ invitation: warnings.notExistInvitation });

        return resolve(initInvitationInfo(user, invitation));

    });

};

const getMyInvitationInfo = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { success, warnings } = locale.get("invitations");

        const user = req.user;

        const invitation = await Invitation.findOne({ inviterId: user._id });
        if (!invitation) return reject({ invitation: warnings.notExistInvitation });

        return resolve(initInvitationInfo(user, invitation));

    });

};

const getInvitationsInfo = (req, res) => {

    return new Promise(async (resolve, reject) => {

        const user = req.user;

        const invitations = await Invitation.find({});
        const invitationsInfo = [];

        for (const invitation of invitations) {
            invitationsInfo.push(user, invitation);
        }

        return resolve(invitationsInfo);

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

        let invitation = await Invitation.findOne({ inviterId: user._id });

        if (!invitation) {
            invitation = await createInvitation(req, res);
        } else {
            const code = await Invitation.generateUniqueInviteCode(Invitation);
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
        if (invitation.inviterId.toString() == user._id.toString()) return reject({ user: warnings.useOwnInviteCode });
        if (user.invitedBy) return reject({ user: warnings.alredyUseInviteCode });

        user.invitedBy = invitation.inviterId;
        invitation.uses.push(user._id);

        await user.save({ validateBeforeSave: false });
        await invitation.save({ validateBeforeSave: false });

        return resolve(true);
    });

};

async function isValidInvitationCode(code) { // Used in register function
    if (!code) return true;
    const invitation = await Invitation.findOne({ code: (typeof code == "string" && code.trim().length) ? code.trim() : null });
    if (!invitation) return false;
}

module.exports = {
    getInvitationInfo,
    getMyInvitationInfo,
    getInvitationsInfo,
    createInvitation,
    reCreateInvitationCode,
    useInvitationCode,
    isValidInvitationCode
}
