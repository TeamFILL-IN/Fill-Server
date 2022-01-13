const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { curationDB, photoDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

module.exports = async (req, res) => {
  let client;

  try {
    client = await db.connect(req);

    const curation = await curationDB.getCuration(client);
    if (!curation) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CURATION));

    const photoList = curation[0].photoList.split(',');
    const photo = await photoDB.getPhotoByCuration(client, photoList);
    if (!photo) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_PHOTO));

    const data = { curation, photo };

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
