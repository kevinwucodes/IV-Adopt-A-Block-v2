"use strict";

// config
var MONGO_URI = process.env.MONGO_URI;
var NODEPORT = process.env.NITROUS_PORT || process.env.OPENSHIFT_PORT || 3000;

// includes
var restify = require('restify');
var mongojs = require('mongojs');
var uuid = require('node-uuid');

// collections config
var db = mongojs(MONGO_URI);

// restify
var server = restify.createServer();
server.use(restify.bodyParser());

/////////////////////////////

//
// POST request
//

server.post('/users', function (req, res, next) {

  /*
  expecting:
  {
    "firstname":"tiger",
    "lastname":"woods",
    "tripCategory":"individual"
  }
  */

  // uuid v4 generation
  var uniqueid = uuid.v4();

  var payload = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    tripCategory: req.body.tripCategory,
    uuid: uniqueid
  }

  console.log(payload);

  // attempt to save to DB
  db.collection('users').save(payload, function(err, doc){
    // lets confirm that everything was truly saved by validating the doc
    if (   doc.firstname === payload.firstname
        && doc.lastname === payload.lastname
        && doc.tripCategory === payload.tripCategory) {
      // yup, lets tell the user it's a-ok
      console.log("yup, it's all the same");
      console.log(doc.uuid);
      console.log(payload.uuid);
      console.log(doc._id);
      
      res.send(201, {status:"created", code: 201});
    }
    else {
      // uh oh, we couldn't save this in the db
      res.send(500, "something went horribly wrong");
    }

  }); //end db.collection
  return next();
});


//
// GET requests
//


server.get('/', function (req, res, next){
  db.collection('users').find(function(err, docs){
    console.log(docs);
  });
q
  res.send(200, "get");
  return next();
});


//
// server launch and listen
//

// lets have the server go and starting listening
server.listen(NODEPORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});