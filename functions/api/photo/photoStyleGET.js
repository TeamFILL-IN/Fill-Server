const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { filmDB, photoDB } = require('../../db');

module.exports = async (req, res) => {

  const { styleId } = req.params;
  if (!styleId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;

  try {
  
    client = await db.connect(req);

    const photosOfFilmStyle = await photoDB.getPhotosByStyle(client, styleId);
    if (photosOfFilmStyle.length == 0) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_PHOTO_OF_STYLE_EXIST));
    
    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_STYLE_SUCCESS, photosOfFilmStyle));
  
  } catch (error) {

    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};
