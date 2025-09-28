const nodemailer = require('nodemailer');

const sendEmail = async options =>{
  //Using gmail service here...
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER, // GMAIL USERNAME
      pass: process.env.GMAIL_PASS // GMAIL PASSWORD
    }
  });

  console.log('user:', process.env.GMAIL_USER);
  console.log('pass:', process.env.GMAIL_PASS);

  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  
  console.log('Email options:', options);


  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;