const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photopagingDB } = require('../../db');
const _ = require('lodash');
const { slack } = require('../../other/slack/slack');

/**
 * @스튜디오별_사진_조회
 * @desc 특정 스튜디오에서 현상한 사진을 조회해요
 */
module.exports = async (req, res) => {
  const { pageNum } = req.query;
  const { studioId } = req.params;
  if (!studioId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  if (pageNum == 0) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.WRONG_PAGENUM));

  
  let client;

  try {
    client = await db.connect(req);

    const photoNum = 10 * ( pageNum - 1 )

    const photos = await photopagingDB.getPhotosByStudio(client, studioId, photoNum);
    const data = { photos };
    if (_.isEmpty(photos)) return res.status(sc.OK).send(success(sc.OK, rm.NO_PHOTO, data));

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_STUDIO_SUCCESS, data));
  
  } catch (error) {
    slack(req, error.message);

    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};

