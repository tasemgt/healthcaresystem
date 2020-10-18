const nodemailer = require('nodemailer');

const sendEmail = async options =>{
  //Using gmail service here...
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    
  });

  const mailOptions = {
    from: 'Michael Tase <tasemgt@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;