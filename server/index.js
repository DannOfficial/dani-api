__path = process.cwd();

require(__path + '/config.js');

const express = require('express');
const cron = require('node-cron');
const path = require('path');

// Db
const db = require('./controller/mysql.js');

const checkAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/');
  }
  next();
};

// Reset limit
cron.schedule('0 0 * * *', () => {
  db.query('[ UPDATE ] >> User has set `Limit` = ' + global.limit.free + ' Where user_type = "Free"', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Limit berhasil di reset!');
  });
  db.query('[ UPDATE ] >> User has set `Limit` = ' + global.limit.premium + ' Where user_type = "Premium"', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Limit Premium berhasil di reset!');
  });
});

var server = express();

// Port
const port = global.port;

// App
const app = require('./app');
server.use(app)

// Error handler for invalid routes
server.use(checkAuth, (req, res, next) => {
  res.status(404).sendFile(path.join(__path, '/public/views/error.html'));
});

// Server listen
server.listen(port, () => {
  console.log('[ STATUS ] >> Server is running on http://localhost:' + port);
});

module.exports = server;