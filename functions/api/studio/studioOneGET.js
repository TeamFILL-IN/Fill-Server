const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { studioDB } = require('../../db');
const slack = require('../../other/slack/slack');

module.exports = async (req, res) => {
  const studioId = req.params.id;
  if (!studioId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const studio = await studioDB.getStudioById(client, studioId);
    if (!studio) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_STUDIO));
    const data = { studio };

    res.status(sc.OK).send(success(sc.OK, rm.READ_ONE_STUDIO_SUCCESS, data));
  } catch (error) {
    slack.slackWebhook(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
