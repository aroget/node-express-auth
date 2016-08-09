const express = require('express');
const path = require('path');
const passport = require('passport');
const logger = require('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const db = require('./mongoose');

require('./passport-init');


// Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const profile = require('./routes/profile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator([]));

app.use(require('express-session')(
  { secret: 'sopa de caracol', resave: false, saveUninitialized: true }
));

app.use(passport.initialize());
app.use(passport.session());

// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Public Routes
app.use(auth);

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
    return;
  }
  res.redirect('/login');
});

// Private Routes
app.use('/', index);
app.use('/profile', profile);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
