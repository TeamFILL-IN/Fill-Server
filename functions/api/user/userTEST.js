const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
// const db = require('../../../db/db');
// const { userDB, postDB } = require('../../../db');

module.exports = async (req, res) => {
  //   const { userId } = req.params;

  //   if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  //   let client;

  try {
    console.log('test');
    return res.status(sc.OK).send(success(sc.OK, '테스트 성공', { 'cicd test': 'cicd test' }));
    // client = await db.connect(req);
    // const user = await userDB.getUserById(client, userId);
    // if (!user) return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NO_USER));

    // const posts = await postDB.getPostsByUserId(client, userId);

    // res.status(sc.OK).send(success(sc.OK, rm.READ_ONE_USER_SUCCESS, { user, posts }));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    // client.release();
  }
};
