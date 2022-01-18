const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');
const _ = require('lodash');
const { slack } = require('../../other/slack/slack');

/**
 * @필름별_사진_조회
 * @desc 필름 아이디를 받아 해당 필름의 사진들을 조회해요
 */
module.exports = async (req, res) => {
  const { filmId } = req.params;
  const userId = req.user.id
  if (!filmId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const photos = await photoDB.getPhotosByFilm(client, filmId);
    if (_.isEmpty(photos)) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO_OF_STYLE_EXIST));
    const likes = await photoDB.isLikedPhoto(client, userId);

    for (let j = 0; j < photos.length; j++) {
      for (let k = 0; k < likes.length; k++) {
        if (photos[j].photoId == likes[k].photoId) {
          photos[j].isLiked = true;
          break;
        } else {
          photos[j].isLiked = false;
        };
      };
      if (!photos[j].isLiked) {
        photos[j].isLiked = false;
      };
    };

    const data = { photos };

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_FILM_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  }
};
