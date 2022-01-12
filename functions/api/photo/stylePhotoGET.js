const functions = require('firebase-functions');
const util = require('../../lib/util');
const statusCode = require('../../constants/statusCode');
const responseMessage = require('../../constants/responseMessage');
const db = require('../../db/db');
const { filmDB, photoDB } = require('../../db');

module.exports = async (req, res) => {

  const {styleId} = req.params;
  if (!styleId) return res.status(statusCode.BAD_REQUEST)
    .send(util.fail
      (
        statusCode.BAD_REQUEST,
        responseMessage.NULL_VALUE
      )
    );
  
  let client;
  
  try {
    client = await db.connect(req);

    const photosOfFilmStyle = await photoDB.getPhotoByStyle(client, styleId);
    
    if (!photosOfFilmStyle) return res.status(statusCode.BAD_REQUEST)
      .send(util.fail
        (
          statusCode.BAD_REQUEST,
          responseMessage.NO_PHOTO_OF_STYLE_EXIST
        )
      );
    
    res.status(statusCode.OK)
      .send(util.success
        (
          statusCode.OK,
          responseMessage.READ_PHOTOS_OF_STYLE_SUCCESS,
          photosOfFilmStyle
        )
      );
  
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);
    
    res.status(statusCode.BAD_REQUEST)
      .send(util.fail
        (
          statusCode.BAD_REQUEST,
          responseMessage.NULL_VALUE
        )
      );
  
  } finally {
    client.release();
  };
};