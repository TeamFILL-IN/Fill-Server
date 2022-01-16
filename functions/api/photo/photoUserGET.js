const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db')
const { slack } = require('../../other/slack/slack');

/**
 * @유저별_사진_조회
 * @desc 특정 유저가 게시한 사진을 조회해요
 */
module.exports = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  
  let client;

  try {
    client = await db.connect(req);

    const photosOfUser = await photoDB.getPhotosByUser(client, userId);
    if (photosOfUser.length == 0) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

    res.status(sc.OK).send(success(sc.OK, rm.READ_PHOTOS_OF_USER_SUCCESS, photosOfUser)); 
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};