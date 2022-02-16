const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { userDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @카메라_추가
 * @desc 마이페이지에서 사용하는 카메라를 변경해요.
 */
module.exports = async (req, res) => {
  const userId = req.user.id;
  const { camera } = req.body;

  if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const updatedUser = await userDB.updateUserCamera(client, userId, camera);
    if (!updatedUser) return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NO_USER));

    res.status(sc.OK).send(success(sc.OK, rm.UPDATE_ONE_USER_SUCCESS, { updatedUser }));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
