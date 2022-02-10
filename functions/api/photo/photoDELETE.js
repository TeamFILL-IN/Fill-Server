const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { photoDB } = require('../../db');
const { slack } = require('../../other/slack/slack');
const { storageDelete } = require('../../lib/storageDelete');

/**
 * @사진_삭제
 * @desc 사진 아이디를 받아 해당 사진을 삭제해요
 */
module.exports = async (req, res) => {
  const { photoId } = req.params;

  if (!photoId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const photo = await photoDB.deletePhoto(client, photoId);
    if (!photo) return res.status(sc.OK).send(success(sc.OK, rm.NO_PHOTO, photo));
    
    const url = photo.imageUrl;

    const deletePhoto = await storageDelete(url);

    res.status(sc.OK).send(success(sc.OK, rm.DELETE_PHOTO_SUCCESS, photo));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  }
};
