const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { userDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @내_정보_조회하기
 * @desc 마이페이지에서의 내 정보를 조회해요.
 */
module.exports = async (req, res) => {
  const userId = req.user.id;

  if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);
    const user = await userDB.getUserById(client, userId);
    if (!user) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_USER));

    res.status(sc.OK).send(success(sc.OK, rm.READ_ONE_USER_SUCCESS, { user }));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};