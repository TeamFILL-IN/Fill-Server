const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');
const _ = require('lodash');
const { slack } = require('../../other/slack/slack');

/**
 * @전체_사진_조회
 * @desc 게시된 전체 사진들을 조회해요
 */
module.exports = async (req, res) => {
  const userId = req.user.id;

  let client;

  try {
    client = await db.connect(req);

    const photos = await photoDB.getAllPhotos(client);
    if (_.isEmpty(photos)) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

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

    res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_PHOTOS_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
