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


//
// UPLOAD testing
//

server.post({
  path: '/users/images',
  version: '1.0.0'
}, r.usersImages);

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




// var temp_session_token = "afea4efb9dfb57da043646bcce480f78fb66f266ffadf3b2d764cce30e63c4c1a2335705104c966e601f67dbdc5e9c4d227509bbdea6a0bd2bd09c20e6e89cbc113e7cba70e20701";

// request
//   .post(mediafire.url.postSimpleImage)
//   .query({ session_token: temp_session_token})
//   .attach('image', '/tmp/73fbd3c13c249bb9d002494abc364c8d')
//   .end(function(a,b,c,d) {
//     console.log("a ", a);
//     console.log("b ", b);
//     console.log("c ", c);
//     console.log("d ", d);
//   });




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