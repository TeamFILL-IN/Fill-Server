const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db')
module.exports = async (req, res) => {

  const { styleId } = req.params;
  
  const { pageNum } = req.query;

  if (!styleId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;

  try {
  
    client = await db.connect(req);

    const photoNum = 10 * ( pageNum - 1 )
    
    const photosOfFilmStyle = await photoDB.getPhotosByStyle(client, styleId, photoNum);

    if (photosOfFilmStyle.length == 0) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO_OF_STYLE_EXIST));
    
    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_STYLE_SUCCESS, photosOfFilmStyle));
  
  } catch (error) {

    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};
