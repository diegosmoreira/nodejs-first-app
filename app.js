const express = require('express');
const app = express();
const router = require('./routes/index');
const mustache = require('mustache-express');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname +'/public'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/User');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user;
    next();
});

app.use('/', router);
app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');
app.use(errorHandler.notFound);

module.exports = app;