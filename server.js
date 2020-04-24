const app = require('./app');
const mongo = require('mongoose');

app.set('port', 7777);

mongo.connect('mongodb://127.0.0.1:27017/blog', {useUnifiedTopology: true, useNewUrlParser: true});

mongo.Promise = global.Promise;
mongo.connection.on('error', (error) =>{
    console.error('ERROR: ' + error.message);
});

const server = app.listen(app.get('port'), () => {
    console.log('Server running on port: ' + server.address().port);
});