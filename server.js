const app = require('./app.js');
const config = require('config');
const port = config.host.port;

var server = app.listen(port, function () {
    console.log('Express server is listening on port ' + port);
});