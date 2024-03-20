__path = process.cwd();
require(__path + '/config.js');
const crypto = require('crypto');
const express = require('express');

var router = express.Router();

// Lib
const { generateOTP, generateRandomByte } = require('../lib/function.js');
// Db
const db = require(__path + '/server/controller/mysql.js');
// Nodemailer
const { sendEmailOTP, sendResetPasswordEmail } = require('../controller/nodemailer');
const checkAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }
  next();
};

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/home', (req, res) => {
  res.redirect('/');
});

router.get('/dashboard', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('pages-dashboard', { user });
    } else {
      res.send(`<p>User not found!</p>`);
    }
  });
});

router.get('/login', (req, res) => {
  res.render('auth-login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) {
      console.log(err);
    }

    if (result.length > 0) {
      const user = result[0];

      if (user.otp_verified) {
        req.session.username = username;
     // req.flash('success_msg', "Login berhasil!");
        res.redirect("/dashboard");
      } else {
        res.send(`<script>alert('OTP belum diverifikasi!'); window.location.href = '/login';</script>`);
      }
    } else {
      res.send(`<script>alert('Username atau Password salah!'); window.location.href = '/login';</script>`);
    }
  });
});

router.get('/register', (req, res) => {
  res.render('auth-register');
});

router.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.send(`<script>alert('Username sudah terdaftar!'); window.location.href = '/register';</script>`);
    } else {
      const userKeys = generateRandomByte(6);
      const otp = generateOTP();

      sendEmailOTP(email, otp, (err) => {
        if (err) {
          console.log('Gagal mengirim email OTP:', err);
          res.send(`<script>alert('Registrasi gagal!'); window.location.href = '/register';</script>`);
        } else {
          db.query('INSERT INTO users (email, username, password, user_keys, otp) VALUES (?, ?, ?, ?, ?)', [email, username, password, userKeys, otp], (err) => {
            if (err) {
              throw err;
            }
            res.send(`<script>alert('Registrasi berhasil! Silakan periksa email Anda untuk OTP.'); window.location.href = '/verify';</script>`);
          });
        }
      });
    }
  });
});

router.get('/verify', (req, res) => {
  res.render('auth-verify-otp');
});

router.post('/verify', (req, res) => {
  const { otp } = req.body;

  db.query('SELECT * FROM users WHERE otp = ?', [otp], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      db.query('UPDATE users SET otp_verified = true WHERE otp = ?', [otp], (err) => {
        if (err) {
          console.log('Gagal memperbarui status verifikasi OTP:', err);
          res.send(`<script>alert('Verifikasi OTP gagal!')</script>`);
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.send(`<script>alert('OTP salah!'); window.location.href = '/verify';</script>`);
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/forgot-password', (req, res) => {
  res.render('auth-forgot-password');
});

router.post('/forgot-password', (req, res) => {
  const email = req.body.email;
  const hostname = req.hostname;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];
      const token = crypto.randomBytes(20).toString('hex');

      sendResetPasswordEmail(email, token, hostname, (err) => {
        if (err) {
          console.log('Failed to send reset password email:', err);
          res.send(`<script>alert('Failed to send reset password email.'); window.location.href = '/forgot-password';</script>`);
        } else {
          res.send(`<script>alert('Email with reset password link has been sent.'); window.location.href = '/forgot-password';</script>`);
        }
      });
    } else {
      res.send(`<script>alert('Email is not registered.'); window.location.href = '/forgot-password';</script>`);
    }
  });
});

router.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;

  db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()', [token], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.render('auth-reset-password', { token });
    } else {
      res.send(`<script>alert('Token reset password tidak valid atau telah kedaluwarsa.'); window.location.href = '/forgot-password';</script>`);
    }
  });
});

router.post('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.password;

  db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()', [token], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      db.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?', [newPassword, user.id], (err) => {
        if (err) {
          throw err;
        }
        console.log('Kata sandi berhasil direset.');

        res.send(`<script>alert('Kata sandi Anda telah direset. Silakan login dengan kata sandi baru.'); window.location.href = '/login';</script>`);
      });
    } else {
      res.send(`<script>alert('Token reset password tidak valid atau telah kedaluwarsa.'); window.location.href = '/forgot-password';</script>`);
    }
  });
});

router.get('/profile', checkAuth, (req, res) => {
  res.redirect('/account');
});

router.get('/pricing', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('pages-pricing', { user });
    } else {
      res.send(`<p>User not found!</p>`);
    }
  });
});

router.get('/checkout', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('checkout', { user });
    } else {
      res.send(`<p>User not Found!</p>`);
    }
  });
});

router.get('/payment', checkAuth, (req, res) => {
  const username = req.session.username;
  const { name, email, plan, expired_plan_date, payment_method, price_display } = req.query;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('payment', { user, name, email, plan, expired_plan_date, payment_method, price_display });
    } else {
      res.send(`<p>User not Found!</p>`);
    }
  });
});

router.get('/report', checkAuth, (req, res) => {
  const username = req.session.username;
  const report = req.query;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('report', { user, report });
    } else {
      res.send(`<p>User not found!</p>`);
    }
  });
});

router.get('/account', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('pages-account', { user });
    } else {
      res.send(`<p>User not found!</p>`);
    }
  });
});

router.post('/update-data', (req, res) => {
  const { username, email, password } = req.body;
  const sessionUsername = req.session.username;

  db.query('SELECT user_type FROM users WHERE username = ?', [sessionUsername], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];
        const updatedData = {};
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (password) updatedData.password = password;

        db.query('UPDATE users SET ? WHERE username = ?', [updatedData, sessionUsername], (err) => {
          if (err) {
            throw err;
          }

          res.redirect('/account');
        });
      } else {
      res.send('User tidak ditemukan');
    }
  });
});

router.post('/update-keys', (req, res) => {
  const { user_keys } = req.body;
  const sessionUsername = req.session.username;

  db.query('SELECT user_type FROM users WHERE username = ?', [sessionUsername], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      if (user.user_type === 'Premium') {
        const updatedData = {};
        if (user_keys) updatedData.user_keys = user_keys;

        db.query('UPDATE users SET ? WHERE username = ?', [updatedData, sessionUsername], (err) => {
          if (err) {
            throw err;
          }

          res.redirect('/account');
        });
      } else {
        res.send(`<script>alert('Anda tidak dapat mengubah API Keys, harap upgrade ke Premium terlebih dahulu!'); window.location.href = '/pricing';</script>`);
      }
    } else {
      res.send(`<script>alert('User tidak ditemukan!''); window.location.href = '/account';</script>`);
    }
  });
});

router.post('/delete-account', (req, res) => {
  const sessionUsername = req.session.username;

  db.query('DELETE FROM users WHERE username = ?', [sessionUsername], (err) => {
    if (err) {
      throw err;
    }

    req.session.destroy();
    res.redirect('/');
  });
});

router.get('/downloader', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-downloader', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/searcher', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-searcher', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/artificial-intelligence', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-artificial-intelligence', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/canvas', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-canvas', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/textpro', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-textpro', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/photooxy', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-photooxy', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/game', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-game', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/top-up', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-top-up', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/url-shortener', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-url-shortener', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/anime', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-anime', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/stalker', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-stalker', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

router.get('/tools', checkAuth, (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];

      res.render('features-tools', { user });
    } else {
      res.send(`<p>No user found!</p>`);
    }
  });
});

module.exports = router;