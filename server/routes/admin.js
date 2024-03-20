__path = process.cwd();

require(__path + '/config.js');

const express = require('express');

// Db
const db = require(__path + '/server/controller/mysql.js');

// Nodemailer
const {
  sendBroadcastEmails
} = require('../controller/nodemailer');

var router = express.Router();

function checkAuth(req, res, next) {
  const password = req.query.password;

  if (password === global.password_admin) {
    req.isAdmin = true;
    next();
  } else {
    req.isAdmin = false;
    next();
  }
}

router.get('/', checkAuth, (req, res) => {
  const sessionUsername = req.session.username;

  if (req.isAdmin) {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length > 0) {
        const users = result;
        res.render('admin', {
          users
        });
      } else {
        res.send('<p>User not Found!</p>');
      }
    });
  }
});

router.get('/add-user', checkAuth, (req, res) => {
  res.render('add-user');
});

router.post('/add-user', checkAuth, (req, res) => {
  const {
    username,
    email,
    password,
    user_type,
    user_keys,
    limit
  } = req.body;

  db.query(
    'INSERT INTO users (username, email, password, user_type, user_keys, `limit`, otp_verified) VALUES (?, ?, ?, ?, ?, ?, 1)',
    [username, email, password, user_type, user_keys, limit],
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect('/admin?password=' + global.password_admin);
    }
  );
});

router.post('/update-data', checkAuth, (req, res) => {
  const {
    userId, username, email, password, user_keys, limit
  } = req.body;

  const updatedData = {};
  if (username) updatedData.username = username;
  if (email) updatedData.email = email;
  if (password) updatedData.password = password;
  if (user_keys) updatedData.user_keys = user_keys;
  if (limit) updatedData.limit = limit;

  db.query('UPDATE users SET ? WHERE id = ?', [updatedData, userId], (err) => {
    if (err) {
      throw err;
    }

    res.redirect('/admin?password=' + global.password_admin);
  });
});

router.post('/delete-data', checkAuth, (req, res) => {
  const userId = req.body.userId;

  db.query('DELETE FROM users WHERE id = ?',
    [userId],
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect('/admin?password=' + global.password_admin);
    });
});

router.post('/update-premium', checkAuth, (req, res) => {
  const {
    userId, isPremium
  } = req.body;

  db.query('UPDATE users SET user_type = ? WHERE id = ?',
    [isPremium,
      userId],
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect('/admin?password=' + global.password_admin);
    });
});

router.post('/broadcast', (req, res) => {
  const { subject, message } = req.body;

  db.query('SELECT email FROM users', (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      const emails = result.map(user => user.email);

      sendBroadcastEmails(emails, subject, message, (error) => {
        if (error) {
          console.log('Gagal mengirim pesan siaran:', error);
          res.send(`<script>alert('Gagal mengirim pesan siaran'); location.href = '/admin?password=${global.password_admin}';</script>`);
        } else {
          console.log('Pesan siaran terkirim');
          res.send(`<script>alert('Broadcast telah dikirim!'); location.href = '/admin?password=${global.password_admin}';</script>`);
        }
      });
    } else {
      res.send('<p>Tidak ada pengguna yang ditemukan!</p>');
    }
  });
});

module.exports = router;