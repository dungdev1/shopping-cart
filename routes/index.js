var express = require('express');
var router = express.Router();      //modular, mountable route handlers, it is complete middleware and routing system, as "mini-app"
const csrf = require('csurf');
const passport = require('passport');

const Product = require('../models/product');
const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
// This will render index.hbs into views/layouts/layout.hbs
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    let productChunks = [];
    let chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('./shop/index', { title: 'Shopping cart', products: productChunks });
  });
});

router.get('/user/signup', function(req, res, next) {
  let messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signup', passport.authenticate('local.signup', { successRedirect: '/user/profile', failureRedirect: '/user/signup', failureFlash: true}));

router.get('/user/profile', function(req, res, next) {
  res.render('user/profile');
})
module.exports = router;
