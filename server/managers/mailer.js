const nodemailer = require("nodemailer");
const locale = require('../../locales/index');

class Mailer {
  
  constructor (email, password) {
    this.email = email;
    this.password = password;
    this.message = null;
  }
  
  setMessage (msgDetails) {
    this.message = msgDetails;
  }
  
  async send (toEmails) {
    if (Array.isArray(toEmails)) toEmails = toEmails.join(', ');
    
    const transporter = nodemailer.createTransport({
      service: toEmails.split('.')[0].toLowerCase().trim(),
      auth: {
        user: this.email,
        pass: this.password,
      }
    });
    
    const msg = this.message;
    const emailTemplate = require(`../../interfaces/views/templates/${locale.getLang()}/${msg.template}`);
    
    try {
      const mailInfo = await transporter.sendMail({
        from: `"${process.env.HOSTNAME}" <linestore@example.com>`,
        to: toEmails,
        subject: `-[${process.env.HOSTNAME}] ${msg.title}`,
        html: emailTemplate(msg.content),
      });

      return true;
    } catch (err) {
      return err;
    }
    
  }
  
}

module.exports = new Mailer(process.env.EMAIL, process.env.PASSWORD);
