const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');

module.exports = async (req, res) => {
  let client;

  const { pageNum } = req.query;

  try {
    client = await db.connect(req);

    photoNum = 10 * ( pageNum - 1 )

    const photos = await photoDB.getAllPhotos(client, photoNum);
    
    if (!photos) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));
    
    const data = { photos };

    res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_PHOTOS_SUCCESS, data));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
