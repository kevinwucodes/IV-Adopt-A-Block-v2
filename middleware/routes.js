"use strict";

// includes
var mongojs = require('mongojs');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');


// include local
var config = require('./config');
var mediafire = require('./mediafire');
var mailer = require('./mailer');

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

  // uuid v4 generation
  var uniqueid = uuid.v4();

  var payload = {
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    },
    tripCategory: req.body.tripCategory,
    uuid: uniqueid,
    now: new Date().getTime()
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
      return next(err);
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

//
// image routing
//

module.exports.usersImages = function(req, res, next) {

  /*
  expecting:
  Content-type: multipart/form-data

  {
    tripID: "a23e5bed-658c-4d0d-8622-8ea8a6e9c8ae",
    imageType: "JPG",
    blob: <multipart representation>,
    type: "hazard",
    comment: "bring something to clean up glass please",
    point: {
      "lat": 34.409094,
      "long": -119.854158,
      "epoch": 1405659960723
    }
  }
  */

  console.log("****** userImages route ******");

  var now = new Date().getTime();

  // generate a UUID for this image
  var uniqueid = uuid.v4();

  // need to parse req.body.point because this is coming in as a multipart/form-data
  var point = JSON.parse(req.body.point);

  var payload = {
    tripID: req.body.tripID,
    imageType: req.body.imageType,
    type: req.body.type,
    comment: req.body.comment,
    point: point,

    received: now,
    imageID: uniqueid
  }

  // checking require inputs, we check this after due to JSON parsing issues
  if (payload.tripID === undefined || payload.tripID.length !== 36 ||
    payload.imageType === undefined || payload.imageType.length === 0 ||

    // blob requirements need to be here too
    req.files.blob.path === undefined || req.files.blob.path === 0 ||

    payload.type === undefined || payload.type.length === 0 ||
    payload.point.lat === undefined || payload.point.lat.length === 0 ||
    payload.point.long === undefined || payload.point.long.length === 0 ||
    payload.point.epoch === undefined || payload.point.epoch <= 1000000000000) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
  }

  // get the byte size of the image
  payload.size = req.files.blob.size;

  // console.log(payload);




  // current full path of the image, including basename
  var currentPath = path.dirname(req.files.blob.path);

  // new full path of the image, using the UUID as name
  var newBaseName = currentPath + "/" + uniqueid;

  // renaming the file from current to new full path name
  fs.rename(req.files.blob.path, newBaseName, function(err) {
    if (err) throw err;

    // TODO: send mail to adam
    // TODO: delete the /tmp/ file


    /////
    // BEGIN EMAIL PROCESS
    /////

    var emailText = "comment: " + payload.comment + "\n";
    emailText += "Link to location: \n\n";
    emailText += "http://maps.google.com/maps?&z=10&q=" + point.lat + "+" + point.long + "&ll=" + point.lat + "+" + point.long;

    // send email to administrator
    mailer.sendmail({
      subject: "IV AAB system-mailer: hazard image",
      text: emailText,
      attachment: newBaseName
    }, function(err, result) {
      if (err) throw err;
      console.log("sendmail err ", err);
      console.log("sendmail result ", result);

    });


    /////
    // upload to mediafire
    ///// 

    mediafire.upload(newBaseName, function(err, details) {
      if (err) throw err;

      console.log("mediafire upload details: ", details);

      var fileKey = details.fileKey;

      // now save the details (filekey) to the db
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
              mediafireFileKey: fileKey,
              received: payload.received
            }
          }
        },

        fields: {
          "trips.$": 1
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
          // TODO: do we delete the image?  or have the administrator check out?
          return next();
        }

        // did mongo report back a single updated document?
        if (lastErrorObject.updatedExisting === true && lastErrorObject.n === 1) {
          res.send(201, {
            status: "success",
            message: "added image details for tripID " + payload.tripID
          });
          return next();
        }
      }); //db.collection
    }); //mediafire.upload
  }); //fs.rename









  // res.send('done');
  // next();

};
