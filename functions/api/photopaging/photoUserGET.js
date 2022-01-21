const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photopagingDB, photoDB } = require('../../db');
const _ = require('lodash');
const { slack } = require('../../other/slack/slack');

/**
 * @유저별_사진_조회
 * @desc 유저 아이디를 받아 해당 유저가 게시한 사진들을 조회해요
 */
module.exports = async (req, res) => {
  const myId = req.user.id;
  const { pageNum } = req.query;
  const { userId } = req.params;
  if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  if (pageNum == 0) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.WRONG_PAGENUM));

  
  let client;

  try {

    client = await db.connect(req);

    const photoNum = 10 * ( pageNum - 1 )

    const photos = await photopagingDB.getPhotosByUser(client, userId, photoNum);
    const data = { photos }
    if (_.isEmpty(photos)) {

      return res.status(sc.OK).send(success(sc.OK, rm.NO_PHOTO, data));
    }
    const likes = await photoDB.isLikedPhoto(client, myId);
    
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


    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_USER_SUCCESS, data));    
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};