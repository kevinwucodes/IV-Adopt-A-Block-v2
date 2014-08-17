"use strict";

// includes
var restify = require('restify');
var fs = require('fs');
var request = require('superagent');

// include local
var config = require('./config');
var r = require('./routes');
var mediafire = require('./mediafire');

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
// GET requests
//

server.get('/', function(req, res, next) {  
  res.send(200, "get");
  return next();
});


//
// GET static requests
//

console.log(__dirname);

server.get('/static/properties/v1/mapboxProperties.json', function(req, res, next) {
  var file = "".concat(__dirname, '/static/properties/v1/mapboxProperties.json');

  res.setHeader("content-type", "application/json");
  fs.createReadStream(file).pipe(res);
});


//
// UPLOAD testing
//

var respond = function(req, res, next) {
  res.send('hello ' + req.params.name);
}

var echo_upload_file = function(req, res, next) {
  console.log('XXXX: BODY', req.body)
  console.log('XXXX params', req.params)
  console.log('XXXX UPLOADED FILES', req.files)
  res.send('done');
  next();
}


server.post('/upload', echo_upload_file);

//
// mediafire testing
//

// console.log(mediafire.url.getSession);


// example
// request
//    .post('/api/pet')
//    .send({ name: 'Manny', species: 'cat' })
//    .set('X-API-Key', 'foobar')
//    .set('Accept', 'application/json')
//    .end(function(res){
//      if (res.ok) {
//        alert('yay got ' + JSON.stringify(res.body));
//      } else {
//        alert('Oh no! error ' + res.text);
//      }
//    });


// // good
// request
//   .post(mediafire.url.getSession)
//   .query({ email: config.mediafire.email })
//   .query({ password: config.mediafire.password })
//   .query({ application_id: config.mediafire.application_id })
//   .query({ signature: config.mediafire.signature_sha })
//   .query({ response_format: 'json' })
//   .send()
//   .end(function(a,b,c,d) {
//     console.log("a ", a);
//     console.log("b ", b);
//     console.log("c ", c);
//     console.log("d ", d);

// });




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