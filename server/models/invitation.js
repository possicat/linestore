const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const generateUniqueId = require('generate-unique-id');
const locale = require('../../locales/index');
//

const invitationSchema = new mongoose.Schema({
    inviterId: {
        type: ObjectId,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    uses: {
        type: [ObjectId],
        default: []
    }
}, { timestamps: true });

// -----


invitationSchema.statics.generateUniqueInviteCode = async (model) => {

    let code;
    do {
        code = generateUniqueId({ length: 6, useLetters: true }).toString();
    } while (!(await model.findOne({ code })));

    return code.trim();

};

invitationSchema.statics.getInvitationByInviterId = async (id = '', model) => {

  if (!ObjectId.isValid(id.trim())) return null;
  
  const invitation = await model.findOne({ inviterId: id.trim() });
  if (!invitation) return null;
  
  return invitation;

};

invitationSchema.statics.handleErrors = (error) => {
  
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


const Invitation = mongoose.model("invitations", invitationSchema);

module.exports = Invitation;
