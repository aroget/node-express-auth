const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const User = require('../models/user');

const router = new express.Router();

/**
 * LOGIN
 */
router.get('/login', (req, res, next) => {
  if (req.app.get('env') === 'development') {
    User.findOne({}, (err, user) => {
      req.login(user, err => {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    });

    return;
  }

  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.',
}));

/**
 * LOGOUT
 */

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

/**
 * SIGNUP
 */
router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Signup' });
});

router.post('/signup', (req, res, next) => {
  req.checkBody('firstName', 'First Name is required').notEmpty();
  req.checkBody('lastName', 'Last Name is required').notEmpty();
  req.checkBody('username', 'Email is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('passwordConfirmation', 'Password Confirmation is required').notEmpty();

  req.assert('username', 'Does not look like an email address').isEmail();
  req.assert('firstName', 'First Name is not valid').isAlpha();
  req.assert('lastName', 'Last Name is not valid').isAlpha();
  req.assert('password', 'Password must be 6 to 20 characters required').len(6, 20);
  req.assert('passwordConfirmation', 'Password do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    res.render('signup', { flash: { type: 'alert-danger', messages: errors } });
  } else {
    const user = new User({
      firstName: req.sanitize('firstName').escape(),
      lastName: req.sanitize('lastName').escape(),
      username: req.sanitize('username').escape(),
      email: req.sanitize('username').escape(),
      password: bcrypt.hashSync(req.body.password, saltRounds),
    });

    user.save(err => {
      if (err) {
        res.render('signup', { flash: { type: 'alert-error', messages: [{ msg: err }] } });
        res.status(403).end(err);
      } else {
        res.render('signup', { flash: { type: 'alert-success', messages: [{ msg: 'Account Created' }] } });
      }
    });
  }
});

module.exports = router;
