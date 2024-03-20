__path = process.cwd();

const express = require('express');

// Db
const db = require(__path + '/server/controller/mysql.js');

var router = express.Router();

router.get('/username/:name', (req, res) => {
  const username = req.params.name;
  
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.json(`Username: ${username}, terdaftar!`);
    } else {
      res.json(`Username: ${username}, tidak terdaftar!`);
    }
  });
});

router.get('/email/:email', (req, res) => {
  const email = req.params.email;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.json(`Email: ${email}, terdaftar!`);
    } else {
      res.json(`Email: ${email}, tidak terdaftar!`);
    }
  });
});

router.get('/api-key/:key', (req, res) => {
  const key = req.params.key;

  db.query('SELECT * FROM users WHERE user_keys = ?', [key], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.json(`API key: ${key}, terdaftar!`);
    } else {
      res.json(`API key: ${key}, tidak terdaftar!`);
    }
  });
});

router.get('/limit/api-key/:key', (req, res) => {
  const key = req.params.key;

  db.query('SELECT * FROM users WHERE user_keys = ?', [key], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.json(`Sisa limit dari API key: ${key}, yaitu: ${result[0].limit}`);
    } else {
      res.json(`API key: ${key} tidak terdaftar!`);
    }
  });
});

module.exports = router;