const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { studioDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @전체_스튜디오_조회
 * @desc 전체 스튜디오를 조회해요
 */
module.exports = async (req, res) => {
  let client;

  try {
    client = await db.connect(req);

    const studios = await studioDB.getAllStudio(client);
    const data = { studios };
    if (!studios) return res.status(sc.OK).send(success(sc.OK, rm.NO_STUDIO, data));

    res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_STUDIO_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
