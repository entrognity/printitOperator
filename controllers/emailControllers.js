const { sendEmail } = require('../utils/email');

exports.sendCustomEmail = async (req, res) => {
    // Define sender, recipients, and email details
    const senderIdentity = "director";  // Could be 'support', 'info', etc.
    const recipients = ['manishkumarvuttala@gmail.com', 'huzefakhan2491@gmail.com', 'misbahuddinsaudagar@gmail.com'];  // Array of recipient email addresses
    const subject = "Welcome Dear Contributor";

    // Updated email content
    const emailText = `
  Dear Esteemed Contributors,\n\n

  Good evening!\n\n

  We are truly grateful to have you as part of our exciting journey with PinPaper.in. Your insights and contributions play a pivotal role in shaping the future of this venture, and we deeply value your continued support.\n

  As we move forward, we encourage you to share your invaluable ideas, feedback, and expertise. Together, we believe we can elevate PinPaper.in to new heights and achieve something remarkable.\n

  Thank you once again for your commitment and dedication. Let’s make this venture a resounding success!\n\n

  Warm regards,\n
  Mohammed Misbahuddin
`;

    const category = "GREETINGS";  // Optional category
    await sendEmail(senderIdentity, recipients, subject, emailText, category);


};