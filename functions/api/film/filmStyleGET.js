const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { filmDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @필름 스타일별 필름 조회
 * @desc 필름 스타일 아이디를 받아 해당 종류(컬러, 흑백, 특수, 일회용)의 필름들을 조회합니다
 */
module.exports = async (req, res) => {
  const { styleId } = req.params;
  if (!styleId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const filmsOfStyle = await filmDB.getFilmsByStyle(client, styleId);

    if (filmsOfStyle.length == 0) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.INVALID_STYLE_ID));

    res.status(sc.OK).send(success(sc.OK, rm.READ_FILMS_OF_STYLE_SUCCESS, filmsOfStyle));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  } finally {
    client.release();
  }
};
