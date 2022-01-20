const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db')
const _ = require('lodash');
const { slack } = require('../../other/slack/slack');

/**
 * @마이페이지_사진_조회
 * @desc 내가 게시한 사진들을 조회해요
 */
module.exports = async (req, res) => {
  const userId = req.user.id;

  let client;

  try {
    client = await db.connect(req);

    const photos = await photoDB.getPhotosByUser(client, userId);
    const data = { photos };
    if (_.isEmpty(photos)) return res.status(sc.OK).send(success(sc.OK, rm.NO_PHOTO, data));

    res.status(sc.OK).send(success(sc.OK, rm.READ_MYPAGE_PHOTO_SUCCESS, data)); 
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  };
};