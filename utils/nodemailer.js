const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function Nodemailer(recipient, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'onedibecharles19@gmail.com',
      pass: 'chigozie1999', // naturally, replace both with your real credentials or an application-specific password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'E-VOTING-APP', // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    // text: text, // plain text body
    html: `<div><p>VOTING PIN please keep it safe: </p> <h1>${text}</h1></div>`, // html body
  });

  console.log('Message sent: %s', info.messageId);
}

module.exports = Nodemailer;
