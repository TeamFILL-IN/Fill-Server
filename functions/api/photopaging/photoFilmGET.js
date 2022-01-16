const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photopagingDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @필름별 사진 조회
 * @desc 필름 아이디를 받아 해당 필름의 사진들을 조회해요
 */
module.exports = async (req, res) => {

  const { pageNum } = req.query;

  const { filmId } = req.params;
  if (!filmId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const photoNum = 10 * ( pageNum - 1 )

    const photosOfFilm = await photopagingDB.getPhotosByFilm(client, filmId, photoNum);

    if (photosOfFilm.length == 0) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO_OF_STYLE_EXIST));

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_FILM_SUCCESS, photosOfFilm));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  }
};