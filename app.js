const express = require('express');
const app = express();
const router = require('./routes/index');
const mustache = require('mustache-express');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');

app.use((req, res, next) => {
    res.locals.h = helpers;
    next();
});
app.use('/', router);
app.use(express.json());
app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');
app.use(errorHandler.notFound);

module.exports = app;