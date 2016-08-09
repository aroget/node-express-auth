const express = require('express');
const User = require('../models/user');

const router = new express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home' });
});

router.post('/', (req, res, next) => {
  User.findOneAndUpdate(
    { username: req.user.username },
    { $push: { favorites: req.body.mbid } },
    { safe: true, upsert: true }, (err) => {
      if (err) { console.log(err); }
    });
  res.redirect('/');
});

module.exports = router;
