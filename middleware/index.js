"use strict";

// includes
var restify = require('restify');

// include local
var config = require('./config');
var r = require('./routes');

// restify, setting up with SSL certs
var server = restify.createServer(
  /*
  {
  certificate: fs.readFileSync(config.SSL_CERTIFICATE_PATH),
  key: fs.readFileSync(config.SSL_KEY_PATH),
  name: "IV Adopt-a-Block"
  }
  */
);

// restify options
server.use(restify.bodyParser());
server.use(restify.gzipResponse());

/////////////////////////////
// begin requests
/////////////////////////////

//
// POST request
//

// users route
server.post({
  path: '/users',
  version: '1.0.0'
}, r.users);

// waypoints route
server.post({
  path: '/users/waypoints',
  version: '1.0.0'
}, r.usersWaypoints);

// completed route
server.post({
  path: '/users/completed',
  version: '1.0.0'
}, r.usersCompleted);

// paused route
server.post({
  path: '/users/paused',
  version: '1.0.0'
}, r.usersPaused);

// resumed route
server.post({
  path: '/users/resumed',
  version: '1.0.0'
}, r.usersResumed);

//
// UPLOAD images
//

server.post({
  path: '/users/images',
  version: '1.0.0'
}, r.usersImages);

//
// GET requests
//

server.get('/', function(req, res, next) {  
  res.send(200, "get");
  return next();
});


//
// GET static requests
//

server.get('/static/properties/v1/mapboxProperties.json', function(req, res, next) {
  var file = "".concat(__dirname, '/static/properties/v1/mapboxProperties.json');

  res.setHeader("content-type", "application/json");
  fs.createReadStream(file).pipe(res);
});


/////////////////////////////
// end requests
////////////////////////////

//
// server launch and listen
//

// lets have the server go and starting listening
server.listen(config.NODEPORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});