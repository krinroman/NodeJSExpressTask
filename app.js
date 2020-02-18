var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var multer  = require('multer');
var logger = require('morgan');
var session = require('express-session');
var redisStorage = require('connect-redis')(session);
var redis = require('redis');
var client = redis.createClient();
var config = require("./config.js");

var indexRouter = require('./routes/index');

var storageConfig = multer.diskStorage({
destination: (req, file, cb) =>{
    cb(null, "public/images");
  },
  filename: (req, file, cb) =>{
    cb(null, "image_user_"+req.session.userId+path.extname(file.originalname));
  }
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(''));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    store: new redisStorage({
      host: config.host,
      port: 6379,
      client: client
    }),
    secret: config.secretKeySession,
    saveUninitialized: true
  })
)
app.use(multer({storage:storageConfig}).single("filedata"));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
