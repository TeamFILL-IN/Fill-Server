const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db')
const { slack } = require('../../other/slack/slack');

module.exports = async (req, res) => {

  const { studioId } = req.params;

  const { pageNum } = req.query;

  if (!studioId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;

  try {
    client = await db.connect(req);

    const photoNum = 10 * ( pageNum - 1 )

    const photos = await photoDB.getPhotoByStudio(client, studioId, photoNum);
    if (photos.length == 0) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO_OF_STUDIO_EXIST));
    const data = { photos };

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_STUDIO_SUCCESS, data));
  
  } catch (error) {
    slack(req, error.message);

    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};
