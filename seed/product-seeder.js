const mongoose = require('mongoose');
const Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/shopping-cart', {useNewUrlParser: true});

let products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic Video Game',
    description: 'Awesome Game!!!!',
    price: 10
  }),
  new Product({
    imagePath: 'http://eu.blizzard.com/static/_images/games/wow/wallpapers/wall2/wall2-1440x900.jpg',
    title: 'World of Warcraft Video Game',
    description: 'Also awesome? But of course it was better in vanilla ...',
    price: 20
  }),
  new Product({
    imagePath: 'https://support.activision.com/servlet/servlet.FileDownload?file=00PU000000Rq6tz',
    title: 'Call of Duty Video Game',
    description: 'Meh ... nah, it\'s okay I guess',
    price: 40
  }),
  new Product({
    imagePath: 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
    title: 'Minecraft Video Game',
    description: 'Now that is super awesome!',
    price: 15
  }),
  new Product({
    imagePath: 'https://d1r7xvmnymv7kg.cloudfront.net/sites_products/darksouls3/assets/img/DARKSOUL_facebook_mini.jpg',
    title: 'Dark Souls 3 Video Game',
    description: 'I died!',
    price: 50
  })
];

let done = 0;
products.forEach(element => {
  element.save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  })
});

const exit = () => {
  mongoose.disconnect();
}