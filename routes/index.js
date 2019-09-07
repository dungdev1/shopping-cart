var express = require('express');
var router = express.Router(); //modular, mountable route handlers, it is complete middleware and routing system, as "mini-app"
const csrf = require('csurf');
const passport = require('passport');
const {
  check,
  validationResult
} = require('express-validator');

const Product = require('../models/product');
const csrfProtection = csrf();
router.use(csrfProtection);

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

/* GET home page. */
// This will render index.hbs into views/layouts/layout.hbs
router.get('/', function (req, res, next) {
  Product.find(function (err, docs) {
    let productChunks = [];
    let chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('./shop/index', {
      title: 'Shopping cart',
      products: productChunks
    });
  });
});

router.get('/user/signup', function (req, res, next) {
  let messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/user/signup', [
    check('email').not().isEmpty().withMessage('Invalid email'),
    check('password').not().isEmpty().withMessage('Invalid password'),
    check('password').matches(strongRegex).withMessage('This password isn\'t strong\n	The string must contain at least 1 lowercase alphabetical character,\nat least 1 uppercase alphabetical character,\nat least 1 numeric character,\nat least one special character,\nand eight characters or longer')
  ], (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      let messages = [];
      errors.forEach(error => {
        messages.push(error.msg);
      });
      req.flash('error', messages);
      return res.redirect('/user/signup');
    }
    next();
  },
  passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));

router.get('/user/profile', function (req, res, next) {
  res.render('user/profile');
});

router.get('/user/signin', function(req, res, next) {
  let messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/user/signin', [
  check('email').not().isEmpty().withMessage('Invalid email'),
  check('password').not().isEmpty().withMessage('Invalid password')
], (req, res, next) => {
  const errors = validationResult(req).array();
    if (errors.length > 0) {
      let messages = [];
      errors.forEach(error => {
        messages.push(error.msg);
      });
      req.flash('error', messages);
      return res.redirect('/user/signin');
    }
    next();
}, passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


module.exports = router;