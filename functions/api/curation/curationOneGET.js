const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { curationDB, photoDB } = require('../../db');

module.exports = async (req, res) => {
  const { curationId } = req.params;
  if (!curationId) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const curation = await curationDB.getCurationById(client, curationId);
    if (!curation) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_CURATION));
    const data = { curation };

    res.status(sc.OK).send(success(sc.OK, rm.READ_ONE_CURATION_SUCCESS, data));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();    
  }
};
