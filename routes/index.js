var express = require('express');
var router = express.Router(); //modular, mountable route handlers, it is complete middleware and routing system, as "mini-app"

const Product = require('../models/product');
const Cart = require('../models/cart')

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
module.exports = router;