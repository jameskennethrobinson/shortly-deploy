var app = require('./server-config.js');

//var port = 4568;
var port = process.env.port || 1337;
app.listen(port);

console.log('Server now listening on port ' + port);
