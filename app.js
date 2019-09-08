// Imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

// Instantiations
var app = express();

// Configuration
const connection = mongoose.connect('mongodb://localhost:27017/shopping-cart', {useNewUrlParser: true});
require('./config/passport');

// view engine setup
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'layout'}));   // tells Express that for files with extension ".hbs" you would like to call the expressHbs() to render them
app.set('view engine', '.hbs');      // tells Express which template engine to use

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: connection}),
  cookie: {maxAge: 180 * 60 * 1000}
 }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

// use Routes
app.use('/user', userRouter);
app.use('/', indexRouter);

// Error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server export
module.exports = app;
