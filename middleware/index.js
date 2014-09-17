"use strict";

// includes
var restify = require('restify');
var fs = require('fs');

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


// CORS 
server.use(
  function crossOrigin(req, res, next) {
    res.header("Access-Control-Allow-Origin", "danielefani.altervista.org");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);


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

// images route
server.post({
  path: '/users/images',
  version: '1.0.0'
}, r.usersImages);


//
// GET static requests
//

server.get({
  path: '/static/properties/v1/mapboxProperties.json',
  version: '1.0.0'
}, function(req, res, next) {
  var file = "".concat(__dirname, '/static/properties/v1/mapboxProperties.json');

  res.setHeader("content-type", "application/json");
  fs.createReadStream(file).pipe(res);
});

//
// GET requests
//

server.get({
  path: '/',
  version: '1.0.0'
}, function(req, res, next) {
  res.send(200, "get");
  return next();
});

server.get({
  path: '/users/completed/:start/:end',
  version: '1.0.0'
}, r.getCompletedRoutesWithRange);

server.get({
  path: '/users/incomplete/today',
  version: '1.0.0'
}, r.getIncompleteToday);

server.get({
  path: '/users/waypoints/:tripID',
  version: '1.0.0'
}, r.getTripIdDetails);

//sample getlink
server.get({
  path: '/image/:imageID',
  version: '1.0.0'
}, r.getFileLink);








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