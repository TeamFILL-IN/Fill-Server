const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photopagingDB, photoDB } = require('../../db');
const _ = require('lodash');
const { slack } = require('../../other/slack/slack');

/**
 * @필름_종류별_사진_조회
 * @desc 필름 스타일아이디를 받아 해당 필름종류(컬러, 흑백, 특수, 일회용)의 사진들을 조회해요
 */
module.exports = async (req, res) => {
  const userId = req.user.id;
  const { pageNum } = req.query;
  const { styleId } = req.params;
  if (!styleId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  if (styleId > 4) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_STYLE_ID));
  if (pageNum == 0) return res.status(sc.BAD_REQUEST.send(fail(sc.BAD_REQUEST, rm.WRONG_PAGENUM)));


  let client;

  try {
    client = await db.connect(req);

    const photoNum = 10 * ( pageNum - 1 )
    
    const photos = await photopagingDB.getPhotosByStyle(client, styleId, photoNum);
    const data = { photos }
    if (_.isEmpty(photos)) return res.status(sc.OK).send(success(sc.OK, rm.NO_PHOTO, data));

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

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_STYLE_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  }
};
