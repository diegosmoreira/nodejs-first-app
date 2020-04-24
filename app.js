const express = require('express');
const app = express();
const router = require('./routes/index');
const mustache = require('mustache-express');

app.use('/', router);

app.use(express.json());

app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports = app;