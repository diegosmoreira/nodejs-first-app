require('dotenv').config({path: 'variables.env'});

const app = require('./app');
const mongo = require('mongoose');

app.set('port', process.env.PORT || 7777);

mongo.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true});

mongo.Promise = global.Promise;
mongo.connection.on('error', (error) =>{
    console.error('ERROR: ' + error.message);
});

const server = app.listen(app.get('port'), () => {
    console.log('Server running on port: ' + server.address().port);
});