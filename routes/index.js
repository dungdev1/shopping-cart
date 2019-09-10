var express = require('express');
var router = express.Router(); //modular, mountable route handlers, it is complete middleware and routing system, as "mini-app"

const Product = require('../models/product');
const Cart = require('../models/cart')
const Order = require('../models/order');

/* GET home page. */
// This will render index.hbs into views/layouts/layout.hbs
router.get('/', function (req, res, next) {
  let successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    let productChunks = [];
    let chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('./shop/index', {
      title: 'Shopping cart',
      products: productChunks,
      successMsg: successMsg,
      noMessage: !successMsg
    });
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  let productID = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productID, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product._id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
})

router.get('/reduce/:id', function(req, res, next) {
  let productID = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  
  cart.reduceByOne(productID);
  console.log(cart);
  req.session.cart = cart.totalQty === 0 ? null : cart;
  res.redirect('/shopping-cart');
});

router.get('/reduce/all/:id', function(req, res, next) {
  let productID = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  
  cart.removeItem(productID);
  console.log(cart);
  req.session.cart = cart.totalQty === 0 ? null : cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalPrice});
})

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  let cart = new Cart(req.session.cart);

  const stripe = require("stripe")("sk_test_FF14QAGI8uj8VrARF6vyxlfV00fqSwzRyw");

  stripe.charges.create({
    amount: cart.totalPrice * 100 ,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    let order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought products!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
})
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  console.log(req.session.oldUrl);
  res.redirect('/user/signin');
}