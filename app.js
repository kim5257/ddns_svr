var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var auth = require('./routes/auth');

// View
var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var topbar = require('./routes/topbar');
var navbar = require('./routes/navbar');
var userlist = require('./routes/userlist');
var namelist = require('./routes/namelist');

// RESTful APIs
var users = require('./routes/users');
var names = require('./routes/names');

// Load system scripts
var chkexpire = require('./system/chkexpire');
var dbctrl = require('./system/dbctrl');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting passport
app.use(session({secret: 'secret', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
auth();

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/topbar', topbar);
app.use('/navbar', navbar);
app.use('/userlist', userlist);
app.use('/namelist', namelist);
app.use('/users', users);
app.use('/names', names);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
