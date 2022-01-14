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

    //테이블검사(true, false)
    const is_liked = await likeDB.checkLike(client, userId, photoId);   

    //테이블에 있으면 delete
    if (is_liked == true){    
      const studio = await likeDB.deleteLike(client, userId, photoId);
      return res.status(sc.OK).send(success(sc.OK, rm.DELETE_LIKE_SUCCESS));
    }
    //테이블에 없으면 post
    if (is_liked == false){   
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
