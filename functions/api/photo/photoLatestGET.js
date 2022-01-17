const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @최신순_사진_조회
 * @desc 최신순으로 정렬된 사진 중 8장의 사진만 조회해요.
 */
module.exports = async (req, res) => {
  let client;

  try {
    client = await db.connect(req);

    const photos = await photoDB.getLatestPhotos(client);

    if (!photos) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

    const data = { photos };

    res.status(sc.OK).send(success(sc.OK, rm.READ_LATEST_PHOTOS_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
