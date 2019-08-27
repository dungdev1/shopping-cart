var express = require('express');
var router = express.Router();

/* GET home page. */
// This will render index.hbs into views/layouts/layout.hbs
router.get('/', function(req, res, next) {
  res.render('./shop/index', { title: 'Shopping cart' });
});

module.exports = router;
