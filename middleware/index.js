//config
var MONGO_URI = process.env.MONGO_URI;
var NODEPORT = process.env.NITROUS_PORT || process.env.OPENSHIFT_PORT || 3000

//includes
var restify = require('restify');
var mongojs = require('mongojs');


//restify
var server = restify.createServer();



server.listen(NODEPORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
