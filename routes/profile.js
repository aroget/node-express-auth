const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const router = new express.Router();

/**
 * ROOT
 */
router.get('/', (req, res, next) => {
  res.render('profile/profile', { title: 'Profile' });
});

/**
 * GET /UPDATE
 */
router.get('/update', (req, res, next) => {
  res.render('profile/update', { title: 'Update' });
});

/**
 * POST /UPDATE
 */
router.post('/update', (req, res, next) => {
  req.checkBody('firstName', 'First Name is required').notEmpty();
  req.checkBody('lastName', 'Last Name is required').notEmpty();

  req.assert('firstName', 'First Name is not valid').isAlpha();
  req.assert('lastName', 'Last Name is not valid').isAlpha();

  const errors = req.validationErrors();

  if (errors) {
    res.render('profile/update', { flash: { type: 'alert-danger', messages: errors } });
  } else {
    User.findOneAndUpdate(
      { username: req.user.username },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
      { safe: true, upsert: true }, (err) => {
        if (err) { console.log(err); }
        res.render('profile/update',
          { flash: { type: 'alert-success', messages: [{ msg: 'Information Updated' }] } });
      });
  }
});

/**
 * GET /PASSWORD-RESET
 */
router.get('/password-reset', (req, res, next) => {
  res.render('profile/password-reset', { title: 'Reset Password' });
});

/**
 * POST /PASSWORD-RESET
 */
router.post('/password-reset', (req, res, next) => {
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err) { throw new Error(err); }

    if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
      res.render('profile/password-reset',
        { flash: { type: 'alert-danger', messages: [{ msg: 'Old password do not match' }] } });
      return;
    }

    req.assert('newPassword', 'Password must be 6 to 20 characters required').len(6, 20);
    req.assert('confirmPassword', 'Password do not match').equals(req.body.newPassword);

    const errors = req.validationErrors();

    if (errors) {
      res.render('profile/password-reset',
        { flash: { type: 'alert-danger', messages: errors } });
    } else {
      user.password = bcrypt.hashSync(req.body.newPassword, saltRounds);
      user.save();
      res.render('profile/password-reset',
        { flash: { type: 'alert-success', messages: [{ msg: 'Information updated Successfully' }] } });
    }
  });
});

module.exports = router;

module.exports = router;
