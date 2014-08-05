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

  // do we have a firstname?  if not, we need to get out of here
  if (req.body.firstname === undefined || req.body.firstname.length === 0) {
    res.send(500, "firstname cannot be blank");
    return next();
  }

  // do we have a lastname?  if not, we need to get out of here
  if (req.body.lastname === undefined || req.body.lastname.length === 0) {
    res.send(500, "lastname cannot be blank");
    return next();
  }

  // do we have a tripCategory?  if not, we need to get out of here
  if (req.body.tripCategory === undefined || req.body.tripCategory.length === 0) {
    res.send(500, "tripCategory cannot be blank");
    return next();
  }



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

  // do we have a tripID?  if not, we need to get out of here
  if (req.body.tripID === undefined || req.body.tripID.length !== 36) {
    res.send(500, "tripID cannot be blank");
    return next();
  }

  // do we have a lat?  if not, we need to get out of here
  if (req.body.point.lat === undefined || req.body.point.lat.length === 0) {
    res.send(500, "lat cannot be blank");
    return next();
  }

  // do we have a long?  if not, we need to get out of here
  if (req.body.point.long === undefined || req.body.point.long.length === 0) {
    res.send(500, "long cannot be blank");
    return next();
  }

  // do we have a epoch?  if not, we need to get out of here
  if (req.body.point.epoch === undefined || req.body.point.epoch <= 1000000000000) {
    res.send(500, "epoch cannot be blank and must be in milliseconds");
    return next();
  }

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

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      res.send(500, "there was no such tripID");
      return next();
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      res.send(201, "added a point to tripID " + payload.tripID);
      return next();
    }

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