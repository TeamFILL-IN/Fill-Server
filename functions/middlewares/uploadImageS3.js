const admin = require('firebase-admin');
const functions = require('firebase-functions');
const BusBoy = require('busboy');
const dayjs = require('dayjs');
const { firebaseConfig } = require('../config/firebaseClient');
const util = require('../lib/util');
const statusCode = require('../constants/statusCode');
const responseMessage = require('../constants/responseMessage');
const { slack } = require('../other/slack/slack');
const config = require('../config/s3.json');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region
});


const uploadImages = (req, res, next) => {
  const busboy = new BusBoy({ headers: req.headers });

  let filenameUpload;

  let imageFileName = {};

  let fields = {};

  var urlData;

  busboy.on('field', (fieldName, val) => {
    fields[fieldName] = val;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    const rand = Math.round(Math.random() * 1000000000000).toString();
    
    imageFileName = `${dayjs().format('YYYYMMDD_HHmmss_')}${rand}.${imageExtension}`;
    urlData = `https://fill-in.s3.ap-northeast-2.amazonaws.com/${imageFileName}`
    // S3
    s3.upload({
      Bucket: `${config.bucketName}`,
      Key: imageFileName,
      Body: file,
      options: {partSize: 0.5 * 720 * 720, queueSize: 5}
    }).send(function (err, data) {
      if (err) {
        slack(req, err.message);
        console.error(err);
        functions.logger.error(`[FILE UPLOAD ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);
        return res.status(500).json(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
        }
    })
  });
  busboy.on('finish', () => {
    try {
      req.body = fields;
      req.imageUrls = urlData;
      next();
    } catch (err) {
      slack(req, err.message);
      console.error(err);
      functions.logger.error(`[FILE UPLOAD ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);
      return res.status(500).json(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
  });

  busboy.end(req.rawBody);
};

module.exports = uploadImages;
