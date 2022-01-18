const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @사진_첨부
 * @desc 사진을 게시해요
 */
module.exports = async (req, res) => {
  const userId = req.user.id;
  const imageUrl = req.imageUrls;
  const { filmId, studioId } = req.body;
  if (!filmId || !studioId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);
  
    const photo = await photoDB.addPhoto(client, userId,  Number(filmId), Number(studioId), imageUrl);
    if (!photo) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

    res.status(sc.OK).send(success(sc.OK, rm.ADD_PHOTO_SUCCESS, ));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};