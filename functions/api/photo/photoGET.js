const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');

module.exports = async (req, res) => {

  const { photoId } = req.params;
  if (!photoId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;

  try {

    client = await db.connect(req);

    const photoOfId = await photoDB.getPhotoById(client, photoId);

    if (!photoOfId) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTO_SUCCESS, photoOfId));    
  } catch (error) {

    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};