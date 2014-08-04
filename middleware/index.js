"use strict";

// config
var MONGO_URI = process.env.MONGO_URI;
var NODEPORT = process.env.NITROUS_PORT || process.env.OPENSHIFT_PORT || 3000;

// includes
var restify = require('restify');
var mongojs = require('mongojs');
var uuid = require('node-uuid');
var _ = require('underscore');

// collections config
var db = mongojs(MONGO_URI);

// restify
var server = restify.createServer();
server.use(restify.bodyParser());

/////////////////////////////

//
// POST request
//

// users route
server.post({
  path: '/users',
  version: '1.0.0'
}, function(req, res, next) {

  /*
  expecting:
  {
    "firstname":"tiger",
    "lastname":"woods",
    "tripCategory":"individual"
  }
  */

  var now = new Date().getTime();

  // uuid v4 generation
  var uniqueid = uuid.v4();

  var payload = {
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    },
    tripCategory: req.body.tripCategory,
    uuid: uniqueid
  }

  // if we have the user, append a new trip.  If not, we need to create a new user
  db.collection('users').findAndModify({
    query: payload.name,
    update: {

      // the problem with this is that it updates the created every time, not sure how to turn this off
      //       $set: {
      //         created: new Date().getTime()
      //       },      

      // add new tripID to trips array
      $push: {
        trips: {
          tripID: payload.uuid,
          created: now,
          tripCategory: payload.tripCategory
        }
      }
    },

    // returns the modified document instead of the original
    new: true,

    // if it doesn't find, then create a new object of the query
    upsert: true
  }, function(err, doc, lastErrorObject) {

    if (err) {
      return next(err);
    }

    // confirm that everything was truly saved by validating the doc object

    // verify that we have the new tripID inserted
    var wasTripInserted = _.where(doc.trips, {
      tripID: payload.uuid,
      created: now,
      tripCategory: payload.tripCategory
    });

    // was everything saved?
    if (doc.firstname === payload.name.firstname && doc.lastname === payload.name.lastname && wasTripInserted.length) {
      // yup, lets tell the user it's a-ok    
      res.send(201, {
        UUID: wasTripInserted[0].tripID
      });
    } else {
      // uh oh, we couldn't save this in the db
      res.send(500, "something went horribly wrong");
    }
  });

  return next();
});


// waypoints route
server.post({
  path: '/users/waypoints',
  version: '1.0.0'
}, function(req, res, next) {

  /*
  expecting:
  {
    tripID: "a23e5bed-658c-4d0d-8622-8ea8a6e9c8ae",
    point: {
      "lat": 34.409094,
      "long": -119.854158,
      "epoch": 1405659960723
    }
  }
  */

  var now = new Date().getTime();

  var payload = {
    tripID: req.body.tripID,
    point: {
      lat: req.body.point.lat,
      long: req.body.point.long,
      epoch: req.body.point.epoch,
      received: now
    }
  }

  db.collection('users').findAndModify({
    query: {
      "trips.tripID": payload.tripID
    },

    update: {
      // add new point to points array
      $push: {
        "trips.$.points": payload.point
      }
    },

    fields: {
      trips: 1
    }
  }, function(err, doc, lastErrorObject) {

    if (err) {
      return next(err);
    }

    console.log(doc);

  });

  return next();
});


//
// GET requests
//


server.get('/', function(req, res, next) {
  db.collection('users').find(function(err, docs) {
    console.log(docs);
  });
  //   q
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