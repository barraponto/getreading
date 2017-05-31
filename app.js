const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

const config = require('./config');
const {passport} = require('./passport');
const {routeNotFound} = require('./routes/utils');
const index = require('./routes/index');
const users = require('./routes/users');
const {formErrorMiddleware, genericErrorMiddleware} = require('./error');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: config.SECRET, resave: true, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(routeNotFound);

app.use(formErrorMiddleware);
app.use(genericErrorMiddleware);

module.exports = app;
