const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { bookmarkDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @북마크_추가_및_삭제
 * @desc 스튜디오에 대한 북마크를 추가하거나 삭제해요
 */
module.exports = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  const { studioId } = req.body;
  if (!studioId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    //테이블검사(true, false)
    const is_booked = await bookmarkDB.checkBookmark(client, userId, studioId);   

    //테이블에 있으면 delete
    if (is_booked == true){    
      const studio = await bookmarkDB.deleteBookmark(client, userId, studioId);
      return res.status(sc.OK).send(success(sc.OK, rm.DELETE_BOOKMARK_SUCCESS));
    }
    //테이블에 없으면 post
    if (is_booked == false){   
      const studio = await bookmarkDB.postBookmark(client, userId, studioId);
      return res.status(sc.OK).send(success(sc.OK, rm.ADD_BOOKMARK_SUCCESS));
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
