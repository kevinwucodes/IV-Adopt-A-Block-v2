"use strict";

// includes
var mongojs = require('mongojs');
var uuid = require('node-uuid');
var _ = require('underscore');

// include local
var config = require('./config');
// var dbCalls = require('./db');

// mongo collections config
var db = mongojs(config.MONGO_URI);

/////////////////
// exports
/////////////////

module.exports.users = function(req, res, next) {

  /*
  expecting:
  {
    "firstname":"tiger",
    "lastname":"woods",
    "tripCategory":"individual"
  }
  */

  // checking require inputs
  if (req.body.firstname === undefined || req.body.firstname.length === 0 ||
    req.body.lastname === undefined || req.body.lastname.length === 0 ||
    req.body.tripCategory === undefined || req.body.tripCategory.length === 0) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
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
        status: "success",
        UUID: wasTripInserted[0].tripID
      });
    } else {
      // uh oh, we couldn't save this in the db
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    }
  });

  return next();
}

module.exports.usersWaypoints = function(req, res, next) {

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

  // checking require inputs
  if (req.body.tripID === undefined || req.body.tripID.length !== 36 ||
    req.body.point.lat === undefined || req.body.point.lat.length === 0 ||
    req.body.point.long === undefined || req.body.point.long.length === 0 ||
    req.body.point.epoch === undefined || req.body.point.epoch <= 1000000000000) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
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
      res.send(500, {
        status: "error",
        message: "there was no such tripID"
      });
      return next();
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      res.send(201, {
        status: "success",
        message: "added a point to tripID " + payload.tripID
      });
      return next();
    }

  });

  return next();
}

module.exports.usersResumed = function(req, res, next) {

  /*
  expecting:
  {
    tripID: "a23e5bed-658c-4d0d-8622-8ea8a6e9c8ae"    
  }
  */

  // checking require inputs
  if (req.body.tripID === undefined || req.body.tripID.length !== 36) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
  }

  var now = new Date().getTime();

  var payload = {
    tripID: req.body.tripID,    
    resumed: now
  }


  db.collection('users').findAndModify({
    query: {
      "trips.tripID": payload.tripID
    },

    update: {
      // add new point to points array
      $push: {
        "trips.$.gaps.resumed": payload.resumed
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
      res.send(500, {
        status: "error",
        message: "there was no such tripID"
      });
      return next();
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      res.send(201, {
        status: "success",
        message: "added a resumed timestamp tripID " + payload.tripID
      });
      return next();
    }

  });

  return next();
}

module.exports.usersPaused = function(req, res, next) {

  /*
  expecting:
  {
    tripID: "a23e5bed-658c-4d0d-8622-8ea8a6e9c8ae"    
  }
  */

  // checking require inputs
  if (req.body.tripID === undefined || req.body.tripID.length !== 36) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
  }

  var now = new Date().getTime();

  var payload = {
    tripID: req.body.tripID,    
    paused: now
  }


  db.collection('users').findAndModify({
    query: {
      "trips.tripID": payload.tripID
    },

    update: {
      // add new point to points array
      $push: {
        "trips.$.gaps.paused": payload.paused
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
      res.send(500, {
        status: "error",
        message: "there was no such tripID"
      });
      return next();
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      res.send(201, {
        status: "success",
        message: "added a paused timestamp tripID " + payload.tripID
      });
      return next();
    }

  });

  return next();
}

module.exports.usersCompleted = function(req, res, next) {

  /*
  expecting:
  {
    tripID: "a23e5bed-658c-4d0d-8622-8ea8a6e9c8ae",
    comments: "I had a great time picking up trash",
    buckets: 0.75,
    blocks: 1.5
  }
  */

  // checking require inputs
  if (req.body.tripID === undefined || req.body.tripID.length !== 36 ||
    isNaN(req.body.buckets) ||
    isNaN(req.body.blocks)) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
  }

  var now = new Date().getTime();

  var payload = {
    tripID: req.body.tripID,
    comments: req.body.comments,
    buckets: req.body.buckets,
    blocks: req.body.blocks,
    completed: now
  }

  // TODO: need to check to see if final submission has already occurred.  If so, then we need to throw an error

  db.collection('users').findAndModify({
    query: {
      "trips.tripID": payload.tripID
      // $and: [ { "trips.tripID": payload.tripID }, { "trips.$.completed": { $exists: false } } ]
    },

    update: {
      // finalizing trip route by adding buckets, blocks, and a completed value
      $set: {
        "trips.$.buckets": payload.buckets,
        "trips.$.blocks": payload.blocks,
        "trips.$.completed": payload.completed
      }
    },


  }, function(err, doc, lastErrorObject) {

    if (err) {
      return next(err);
    }

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      res.send(500, {
        status: "error",
        message: "there was no such tripID"
      });
      return next();
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      res.send(201, {
        status: "success",
        message: "completed trip for tripID " + payload.tripID
      });
      return next();
    }


  });

  return next();
}