const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { likeDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

module.exports = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  const { photoId } = req.body;
  if (!photoId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const is_liked = await likeDB.checkLike(client, userId, photoId);   //테이블검사(true, false)
    console.log('------', is_liked);
    if (is_liked == true){    //테이블에 있으면 delete
      const studio = await likeDB.deleteLike(client, userId, photoId);
      return res.status(sc.OK).send(success(sc.OK, rm.DELETE_LIKE_SUCCESS));
    }
    if (is_liked == false){   //테이블에 없으면 post
      const studio = await likeDB.postLike(client, userId, photoId);
      return res.status(sc.OK).send(success(sc.OK, rm.ADD_LIKE_SUCCESS, studio));
    }
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
