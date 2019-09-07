var express = require('express');
var router = express.Router(); //modular, mountable route handlers, it is complete middleware and routing system, as "mini-app"

const Product = require('../models/product');


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


module.exports = router;