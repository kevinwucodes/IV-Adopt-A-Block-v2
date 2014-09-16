"use strict";

// includes
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');


// include local
var config = require('./config');
var mediafire = require('./mediafire');
var mailer = require('./mailer');
var db = require('./db');

//
// POST request
//

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

  var payload = {
    name: {
      firstname: req.body.firstname,
      lastname: req.body.lastname
    },
    tripCategory: req.body.tripCategory,
    uuid: uuid.v4(),
    now: new Date().getTime()
  }

  db.saveUsers(payload, function(err, result) {
    if (err) {
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    } else {
      res.send(result.statusCode, {
        status: result.status,
        message: result.message,
        UUID: result.UUID
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

  var payload = {
    tripID: req.body.tripID,
    point: {
      lat: req.body.point.lat,
      long: req.body.point.long,
      epoch: req.body.point.epoch,
      received: new Date().getTime()
    }
  }

  db.saveUsersWaypoints(payload, function(err, result) {
    if (err) {
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    } else {
      res.send(result.statusCode, {
        status: result.status,
        message: result.message
      });
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

  var payload = {
    tripID: req.body.tripID,
    resumed: new Date().getTime()
  }

  db.saveUsersResumed(payload, function(err, result) {
    if (err) {
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    } else {
      res.send(result.statusCode, {
        status: result.status,
        message: result.message
      });
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

  var payload = {
    tripID: req.body.tripID,
    paused: new Date().getTime()
  }

  db.saveUsersPaused(payload, function(err, result) {
    if (err) {
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    } else {
      res.send(result.statusCode, {
        status: result.status,
        message: result.message
      });
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

  var payload = {
    tripID: req.body.tripID,
    comments: req.body.comments,
    buckets: req.body.buckets,
    blocks: req.body.blocks,
    completed: new Date().getTime()
  }

  db.saveUsersCompleted(payload, function(err, result) {
    if (err) {
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    } else {
      res.send(result.statusCode, {
        status: result.status,
        message: result.message
      });
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

  // need to parse req.body.point because this is coming in as a multipart/form-data
  var point = JSON.parse(req.body.point);

  var payload = {
    tripID: req.body.tripID,
    imageType: req.body.imageType,
    type: req.body.type,
    comment: req.body.comment,
    point: point,

    received: new Date().getTime(),
    imageID: uuid.v4()
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

  // current full path of the image, including basename
  var currentPath = path.dirname(req.files.blob.path);

  // new full path of the image, using the UUID as name
  var newBaseName = currentPath + "/" + payload.imageID;

  // renaming the file from current to new full path name
  fs.rename(req.files.blob.path, newBaseName, function(err) {
    if (err) throw err;


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

      payload.fileKey = details.fileKey;

      // now save the details (filekey) to the db
      db.saveUsersImages(payload, function(err, result) {
        if (err) {
          res.send(500, {
            status: "error",
            message: "something went horribly wrong"
          });
        } else {
          res.send(result.statusCode, {
            status: result.status,
            message: result.message
          });
        }
      }); //db.saveUsersImages
    }); //mediafire.upload
  }); //fs.rename


  // res.send('done');
  // next();

};


//
// GET request
//

module.exports.getCompletedRoutesWithRange = function(req, res, next) {
  
  if ( req.params.start === undefined || req.params.start <= 1000000000000
    || req.params.end === undefined || req.params.end <= 1000000000000) {
    var err = new Error();
    err.status = 403;
    err.message = "required values missing";
    return next(err);
  }



  var payload = {
    start: parseInt(req.params.start),
    end: parseInt(req.params.end) 
  }

  //retrieve from DB
  db.getCompletedRoutesWithRange(payload, function(err, result) {
    if (err) {
      res.send(500, {
        status: "error",
        message: "something went horribly wrong"
      });
    } else {
      res.send(200, {
        start: payload.start
        ,end: payload.end
        ,data: result
      });
    }
  });
}