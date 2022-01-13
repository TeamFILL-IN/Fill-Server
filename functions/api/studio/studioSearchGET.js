const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { studioDB } = require('../../db');

module.exports = async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_KEYWORD));

  let client;

  try {
    client = await db.connect(req);
  
    const studio = await studioDB.searchStudio(client, keyword);
    if (!studio) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_STUDIO));
    const data = { studio };

    res.status(sc.OK).send(success(sc.OK, rm.SEARCH_STUDIO_SUCCESS, data));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();    
  }
};
