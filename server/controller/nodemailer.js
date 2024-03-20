__path + process.cwd();

require(__path + '/config.js');
const nodemailer = require('nodemailer');

// Db
const db = require('./mysql.js');

function sendEmailOTP(email, otp, callback) {
  const transporter = nodemailer.createTransport({
    host: global.email_SMTP.host,
    port: global.email_SMTP.port,
    secure: global.email_SMTP.secure,
    auth: {
      user: global.email_SMTP.auth.user,
      pass: global.email_SMTP.auth.pass
    }
  });

  const mailOptions = {
    from: email_SMTP.auth.user,
    to: email,
    subject: 'OTP Verification',
    text: `OTP Anda adalah is ${otp}`
  };

  transporter.sendMail(mailOptions, callback);
}

function sendResetPasswordEmail(email, token, hostname, callback) {
  db.query('SELECT * From users Where email = ?', [email], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];
      const expirationDate = new Date(Date.now() + (60 * 60 * 1000)); // Expiration time: 1 hour from now

      db.query('[ UPDATE ] >> User has set Token reset_token = ?, reset_token_expiration = ? Where id = ?', [token, expirationDate, user.id], (err) => {
        if (err) {
          throw err;
        }
        console.log('Reset password token and expiration time saved to the database.');

        const transporter = nodemailer.createTransport({
          host: global.email_SMTP.host,
          port: global.email_SMTP.port,
          secure: global.email_SMTP.secure,
          auth: {
            user: global.email_SMTP.auth.user,
            pass: global.email_SMTP.auth.pass
          }
        });

        const mailOptions = {
          from: global.email_SMTP.auth.user,
          to: email,
          subject: 'Reset Password',
          html: `
          <p>Hello ${user.username},</p>
          <p>We have received a request to reset your account password. If you did not make this request, please ignore this email. If you wish to reset your password, please click the link below:</p>
          <a href="https://${hostname}/auth/reset-password/${token}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          `
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            throw err;
          }
          console.log('Reset Password telah dikirim kepada:', info.response);
          callback(null);
        });
      });
    } else {
      callback('Email tidak terdaftar.');
    }
  });
}

function sendBroadcastEmails(emails, subject, message, callback) {
  const transporter = nodemailer.createTransport({
    host: global.email_SMTP.host,
    port: global.email_SMTP.port,
    secure: global.email_SMTP.secure,
    auth: {
      user: global.email_SMTP.auth.user,
      pass: global.email_SMTP.auth.pass
    }
  });

  const mailOptions = {
    from: global.email_SMTP.auth.user,
    to: emails.join(','),
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, callback);
}

module.exports = {
  sendEmailOTP, sendResetPasswordEmail, sendBroadcastEmails
};