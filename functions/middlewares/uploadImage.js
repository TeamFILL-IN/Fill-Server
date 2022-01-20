const admin = require('firebase-admin');
const functions = require('firebase-functions');
const BusBoy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const dayjs = require('dayjs');
const { firebaseConfig } = require('../config/firebaseClient');
const util = require('../lib/util');
const statusCode = require('../constants/statusCode');
const responseMessage = require('../constants/responseMessage');
const { slack } = require('../other/slack/slack');

const uploadImage = (req, res, next) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName = {};
  let imagesToUpload = [];
  let imageToAdd = {};
  let imageFileNameForDB;
  let imageUrls, imageUrl;

  let fields = {};

  busboy.on('field', (fieldName, val) => {
    fields[fieldName] = val;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    const rand = Math.round(Math.random() * 1000000000000).toString();

    // Firebase
    imageFileName = `${dayjs().format('YYYYMMDD_HHmmss_')}${rand}.${imageExtension}`;

    // DB
    imageFileNameForDB = `${dayjs().format('YYYYMMDD_HHmmss_')}${rand}_720x720.${imageExtension}`;
    imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileNameForDB}?alt=media`;

    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToAdd = { imageFileName, filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
    imagesToUpload.push(imageToAdd);
  });

  busboy.on('finish', async () => {
    let promises = [];
    imagesToUpload.forEach((imageToBeUploaded) => {
      imageUrls = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageToBeUploaded.imageFileName}?alt=media`;
      promises.push(
        admin
          .storage()
          .bucket(firebaseConfig.storageBucket)
          .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          }),
      );
    });

    try {
      await Promise.all(promises);
      req.body = fields;
      req.imageUrls = imageUrl;
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

module.exports = uploadImage;
