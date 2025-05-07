const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email via Gmail SMTP
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - plain text body
 */
async function sendEmail(to, subject, text) {
  const info = await transporter.sendMail({
    from: `"U-TAD Auth" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text
  });

  console.log('Email sent: %s', info.messageId);
}

module.exports = { sendEmail };
