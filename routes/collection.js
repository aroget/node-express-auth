const express = require('express');

const router = new express.Router();

router.get('/collection', (req, res, next) => {
  res.render('collection', { title: 'Collection' });
});

module.exports = router;
