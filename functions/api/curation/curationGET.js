const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { curationDB, photoDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @큐레이션_랜덤_조회
 * @desc 큐레이션을 랜덤으로 조회해요
 */
module.exports = async (req, res) => {
  const userId = req.user.id;
  
  let client;

  try {
    client = await db.connect(req);

    const curation = await curationDB.getCuration(client);
    if (!curation) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CURATION));

    const photoList = curation.photoList.split(',');
    const photos = await photoDB.getPhotosByCuration(client, photoList);
    if (!photos) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

    const likes = await photoDB.isLikedPhoto(client, userId);
    
    for (let j = 0; j < photos.length; j++) {
      for (let k = 0; k < likes.length; k++) {
        if (photos[j].photoId == likes[k].photoId) {
          photos[j].isLiked = "True";
          break;
        } else {
          photos[j].isLiked = "False";
        };
      };
      if (!photos[j].isLiked) {
        photos[j].isLiked = "False";
      };
    };


    const data = { curation, photos };

    res.status(sc.OK).send(success(sc.OK, rm.READ_RAND_CURATION_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
