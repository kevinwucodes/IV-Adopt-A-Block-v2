"use strict";

// includes
var mongojs = require('mongojs');
var MongoClient = require('mongodb').MongoClient; //this is present because mongojs doesn't have aggregate yet
var _ = require('underscore');

// include local
var config = require('./config');

// mongo collections config
var db = mongojs(config.MONGO_URI);




module.exports.saveUsers = function(payload, callback) {
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
          created: payload.now,
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
      callback("error", null);
    }

    // confirm that everything was truly saved by validating the doc object

    // verify that we have the new tripID inserted
    var wasTripInserted = _.where(doc.trips, {
      tripID: payload.uuid,
      created: payload.now,
      tripCategory: payload.tripCategory
    });

    // was everything saved?
    if (doc.firstname === payload.name.firstname && doc.lastname === payload.name.lastname && wasTripInserted.length) {
      // yup, lets tell the user it's a-ok 
      callback(null, {
        statusCode: 201,
        status: "success",
        message: "all is good",
        UUID: wasTripInserted[0].tripID
      });

    } else {
      // uh oh, we couldn't save this in the db
      callback("error", null);
    }
  });
};


module.exports.saveUsersWaypoints = function(payload, callback) {
  db.collection('users').findAndModify({
    // we want to ensure that we search on a tripID that hasn't been completed
    query: {
      "trips": {
        $elemMatch: {
          "tripID": payload.tripID,
          "completed": {
            $exists: false
          }
        }
      }
    },

    update: {
      // add new point to points array
      $push: {
        "trips.$.points": payload.point
      }
    },

    fields: {
      "trips.$": 1
    }
  }, function(err, doc, lastErrorObject) {

    if (err) {
      callback("error", null);
    }

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      callback(null, {
        statusCode: 403,
        status: "oops",
        message: "there was no such tripID"
      });
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      callback(null, {
        statusCode: 201,
        status: "success",
        message: "added a point to tripID " + payload.tripID
      });
    }

  });
};

module.exports.saveUsersResumed = function(payload, callback) {
  db.collection('users').findAndModify({
    // we want to ensure that we search on a tripID that hasn't been completed
    query: {
      "trips": {
        $elemMatch: {
          "tripID": payload.tripID,
          "completed": {
            $exists: false
          }
        }
      }
    },

    update: {
      // add new point to points array
      $push: {
        "trips.$.gaps.resumed": payload.resumed
      }
    },

    fields: {
      "trips.$": 1
    }
  }, function(err, doc, lastErrorObject) {

    if (err) {
      callback("error", null);
    }

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      callback(null, {
        statusCode: 403,
        status: "oops",
        message: "there was no such tripID"
      });
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      callback(null, {
        statusCode: 201,
        status: "success",
        message: "added a resumed timestamp tripID " + payload.tripID
      });
    }
  });
};


module.exports.saveUsersPaused = function(payload, callback) {
  db.collection('users').findAndModify({
    // we want to ensure that we search on a tripID that hasn't been completed
    query: {
      "trips": {
        $elemMatch: {
          "tripID": payload.tripID,
          "completed": {
            $exists: false
          }
        }
      }
    },

    update: {
      // add new point to points array
      $push: {
        "trips.$.gaps.paused": payload.paused
      }
    },

    fields: {
      "trips.$": 1
    }
  }, function(err, doc, lastErrorObject) {

    if (err) {
      callback("error", null);
    }

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      callback(null, {
        statusCode: 403,
        status: "oops",
        message: "there was no such tripID"
      });
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      callback(null, {
        statusCode: 201,
        status: "success",
        message: "added a paused timestamp tripID " + payload.tripID
      });
    }

  });
};


module.exports.saveUsersCompleted = function(payload, callback) {
  db.collection('users').findAndModify({
    // we want to ensure that we search on a tripID that hasn't been completed
    query: {
      "trips": {
        $elemMatch: {
          "tripID": payload.tripID,
          "completed": {
            $exists: false
          }
        }
      }
    },

    update: {
      // finalizing trip route by adding buckets, blocks, and a completed value
      $set: {
        "trips.$.buckets": payload.buckets,
        "trips.$.blocks": payload.blocks,
        "trips.$.completed": payload.completed
      }
    },

    fields: {
      "trips.$": 1
    }
  }, function(err, doc, lastErrorObject) {

    if (err) {
      callback("error", null);
    }

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      callback(null, {
        statusCode: 403,
        status: "oops",
        message: "there was no such tripID"
      });
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      callback(null, {
        statusCode: 201,
        status: "success",
        message: "completed trip for tripID " + payload.tripID
      });
    }


  });

};

module.exports.saveUsersImages = function(payload, callback) {
  db.collection('users').findAndModify({
    // we want to ensure that we search on a tripID that hasn't been completed
    query: {
      "trips": {
        $elemMatch: {
          "tripID": payload.tripID,
          "completed": {
            $exists: false
          }
        }
      }
    },

    update: {
      // add image to image array
      $push: {
        "trips.$.images": {
          imageID: payload.imageID,
          imageType: payload.imageType,
          type: payload.type,
          size: payload.size,
          comment: payload.comment,
          point: payload.point,
          mediafireFileKey: payload.fileKey,
          received: payload.received
        }
      }
    },

    fields: {
      "trips.$": 1
    }
  }, function(err, doc, lastErrorObject) {

    if (err) {
      callback("error", null);
    }

    // can we find the tripID at all?
    if (lastErrorObject.n === 0) {
      // no, lets tell the user that we couldn't find anything to update/insert
      // TODO: do we delete the image if it fails?  or have the administrator check out?
      callback(null, {
        statusCode: 403,
        status: "oops",
        message: "there was no such tripID"
      });
    }

    // did mongo report back a single updated document?
    if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
      callback(null, {
        statusCode: 201,
        status: "success",
        message: "added image details for tripID " + payload.tripID
      });
    }
  }); //db.collection
};

// GETs

module.exports.getCompletedRoutesWithRange = function(payload, callback) {

  MongoClient.connect(config.MONGO_URI, function(err, db) {
    if (err) throw err;

    db.collection('users', function(err, collection) {

      collection.aggregate([{
        $match: {
          "trips": {
            $elemMatch: {
              "completed": {
                $exists: true
              }
            }
          }
        }
      }, {
        $project: {
          firstname: "$firstname",
          lastname: "$lastname",
          "trips.completed": 1,
          "trips.tripID": 1,
          "trips.created": 1,
          "trips.buckets": 1,
          "trips.blocks": 1
        }
      }, {
        $unwind: "$trips"
      }, {
        $match: {
          "trips.completed": {
            $gte: payload.start,
            $lte: payload.end
          }
        }
      }, {
        $sort: {
          "trips.completed": 1
        }
      }, {
        $group: {
          _id: {
            _id: "$_id",
            firstname: "$firstname",
            lastname: "$lastname"
          },
          trips: {
            $push: "$trips"
          }
        }
      }], function(err, result) {

        var formattedResult = [];

        //lets clean up the result a bit better
        result.forEach(function(user) {
          var newobj = {
            firstname: user._id.firstname,
            lastname: user._id.lastname,
            trips: user.trips
          }
          formattedResult.push(newobj);
        })

        callback(err, formattedResult);
        db.close();
      });
    }); //db.collection('users')
  }); //MongoClient.connect
}



module.exports.getIncompleteToday = function(callback) {
  var now = new Date();
  //todays date at top of midnight
  now.setHours(0, 0, 0, 0);

  MongoClient.connect(config.MONGO_URI, function(err, db) {
    if (err) throw err;

    db.collection('users', function(err, collection) {

      collection.aggregate([{
        $match: {
          "trips": {
            $elemMatch: {
              "completed": {
                $exists: false
              }
            }
          }
        }
      }, {
        $project: {
          firstname: "$firstname",
          lastname: "$lastname",
          "trips.tripID": 1,
          "trips.created": 1
        }
      }, {
        $unwind: "$trips"
      }, {
        $match: {
          "trips.completed": {
            $exists: false
          },
          "trips.created": {
            $gte: now.getTime()
          }
        }
      }, {
        $sort: {
          "trips.created": 1
        }
      }, {
        $group: {
          _id: {
            _id: "$_id",
            firstname: "$firstname",
            lastname: "$lastname"
          },
          trips: {
            $push: "$trips"
          }
        }
      }], function(err, result) {

        var formattedResult = [];

        //lets clean up the result a bit better
        result.forEach(function(user) {
          var newobj = {
            firstname: user._id.firstname,
            lastname: user._id.lastname,
            trips: user.trips
          }
          formattedResult.push(newobj);
        })

        callback(err, formattedResult, now.getTime());
        db.close();
      });

    }); //db.collection('users')
  }); //MongoClient.connect
}