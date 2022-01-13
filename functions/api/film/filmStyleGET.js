const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { filmDB } = require('../../db');
const slack = require('../../other/slack/slack');

module.exports = async (req, res) => {
  const { styleId } = req.params;
  if (!styleId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const filmsOfStyle = await filmDB.getFilmsByStyle(client, styleId);

    if (!filmsOfStyle) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_STYLE_ID));

    res.status(sc.OK).send(success(sc.OK, rm.READ_FILMS_OF_STYLE_SUCCESS, filmsOfStyle));
  } catch (error) {
    slack.slackWebhook(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  }
};
