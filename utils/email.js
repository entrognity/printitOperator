const nodemailer = require('nodemailer');
const { MailtrapTransport } = require("mailtrap");

exports.sendEmail = async (senderIdentity, recipients, subject, emailText, category) => {
    const transporter = nodemailer.createTransport(
        MailtrapTransport({
          token: process.env.MAILTRAP_TOKEN,
        })
      );
      

      const sender = {
        address: `${senderIdentity.toLowerCase()}@pinpaper.in`,
        name: "PinPaper",
      };

      transporter.sendMail({
        from: sender,
        to: recipients,
        subject: subject,
        text: emailText,
        category: category,
      })
      .then(console.log, console.error);
};