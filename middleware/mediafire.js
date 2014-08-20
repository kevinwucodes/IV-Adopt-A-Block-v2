var request = require('superagent');
var parseXml = require('xml2js').parseString;

// include local
var config = require('./config');

var url = {
  getSession: "https://www.mediafire.com/api/1.1/user/get_session_token.php",
  postSimpleImage: "http://www.mediafire.com/api/1.1/upload/simple.php"
}


var getUploadedFileDetails = function(response, callback) {
  // medirefire returns XML, and XML is terrible to work with, so we convert to a plain object instead  
  parseXml(response, function(err, text) {

    // fileResult should be 0    
    var fileResult = text.response.doupload[0].result[0];

    // fileKey length should be greater than 0
    var fileKey = text.response.doupload[0].key[0];

    // responseResult should be "Success"
    var responseResult = text.response.result[0];

    // did mediafire report a success and give us back a filekey?
    if (fileResult == 0 && fileKey.length > 0 && responseResult === "Success") {
      // yes!
      var uploadFileResult = {
        fileResult: fileResult,
        fileKey: fileKey,
        responseResult: responseResult
      }

      callback(null, uploadFileResult);
    }
    else {
    	// return the error
    	callback("error", null);
    }
  });
}


var uploadFile = function(sessionToken, filepath, callback) {
  // post image to mediafire
  request
    .post(url.postSimpleImage)
    .query({
      session_token: sessionToken
    })
    .attach('image', filepath)
    .end(callback);
};



var getSession = function(callback) {
  // get mediafire session
  request
    .post(url.getSession)
    .query({
      email: config.mediafire.email
    })
    .query({
      password: config.mediafire.password
    })
    .query({
      application_id: config.mediafire.application_id
    })
    .query({
      signature: config.mediafire.signature_sha
    })
    .query({
      response_format: 'json'
    })
    .send()
    .end(callback);
};


var upload = function(filepath, callback) {
	// get a mediafire session
  getSession(function(err, res) {  	
    if (err) throw err;
    
    var sessionToken = res.body.response.session_token;

    // then upload
    uploadFile(sessionToken, filepath, function(err, res) {
      if (err) throw err;

      // then get the uploaded result detail
      getUploadedFileDetails(res.text, function(err, details) {
      	// return back to caller      	
        callback(err, details);
      });
    });
  });
}


module.exports.upload = upload;