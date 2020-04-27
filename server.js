require('dotenv').config({path: 'variables.env'});

const mongo = require('mongoose');

mongo.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true});

mongo.Promise = global.Promise;
mongo.connection.on('error', (error) =>{
    console.error('ERROR: ' + error.message);
});

require('./models/Post');

const app = require('./app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
    console.log('Server running on port: ' + server.address().port);
});