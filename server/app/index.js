__path = process.cwd();

require(__path + '/config.js');

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const secure = require('ssl-express-www');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');

// Router
const mainRoute = require('../routes/index.js');
const adminRoute = require('../routes/admin.js');
const apiRoute = require('../routes/api.js');
const checkCredentials = require('../routes/check-credentials.js');

// Db
const db = require('../controller/mysql.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__path + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__path, '/public/views'));
app.set("json spaces", 2)
app.use(secure)
app.use(cors())

app.use(session({
  secret: global.secrect_session,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/', mainRoute);
app.use('/admin', adminRoute);
app.use('/api', apiRoute);
app.use('/check-credentials', checkCredentials);

module.exports = app;