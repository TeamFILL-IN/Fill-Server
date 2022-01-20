const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { studioDB } = require('../../db');
const { slack } = require('../../other/slack/slack');
const _ = require('lodash');

/**
 * @스튜디오_검색
 * @desc 스튜디오를 검색해요
 */
module.exports = async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_KEYWORD));

  let client;

  try {
    client = await db.connect(req);

    const studios = await studioDB.searchStudio(client, keyword);
    const data = { studios };
    if (_.isEmpty(studios)) return res.status(sc.OK).send(success(sc.OK, rm.NO_STUDIO_SEARCHED,data));

    res.status(sc.OK).send(success(sc.OK, rm.READ_STUDIO_SEARCH_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
