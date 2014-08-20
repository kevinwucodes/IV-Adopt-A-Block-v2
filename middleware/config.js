"use strict";

// includes
var crypto = require('crypto');
var sha1 = crypto.createHash('sha1');

// config http
module.exports.NODEPORT = process.env.NITROUS_PORT || process.env.JITSU_PORT || process.env.OPENSHIFT_PORT || 3000;
module.exports.SSL_CERTIFICATE_PATH = process.env.SSL_CERTIFICATE_PATH;
module.exports.SSL_KEY_PATH = process.env.SSL_KEY_PATH;

// config: mongo
module.exports.MONGO_URI = process.env.MONGO_URI;

// config: mediafire (unless someone else can find a better storage file service and API)
var mediafire = {
	email: process.env.MEDIAFIRE_EMAIL,
	password: process.env.MEDIAFIRE_PASSWORD,
	application_id: process.env.MEDIAFIRE_APPLICATIONID,
	apikey: process.env.MEDIAFIRE_APIKEY
}

// mediafire requires a sha1 of your email + password + application_id + API Key
mediafire.signature = mediafire.email + mediafire.password + mediafire.application_id + mediafire.apikey;
mediafire.signature_sha = sha1.update(mediafire.signature).digest('hex');


// module.exports.MEDIAFIRE_SIGNATURE_SHA = mediafire.signature_sha;

module.exports.mediafire = mediafire;