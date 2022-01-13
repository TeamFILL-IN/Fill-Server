const functions = require('firebase-functions');
const jwt = require('../lib/jwt');
const db = require('../db/db');
const { success, fail } = require('../lib/util');
const sc = require('../constants/statusCode');
const rm = require('../constants/responseMessage');
const { userDB } = require('../db');
const { TOKEN_INVALID, TOKEN_EXPIRED } = require('../constants/jwt');
const slack = require('../other/slack/slack');

const auth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.TOKEN_EMPTY));

  let client;

  try {
    client = await db.connect(req);

    const decodedToken = jwt.verify(token);
    if (decodedToken === TOKEN_EXPIRED) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.TOKEN_EXPIRED));
    if (decodedToken === TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));

    const userId = decodedToken.id;
    if (!userId) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));

    const user = await userDB.getUserById(client, userId);

    if (!user) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.NO_USER));

    // 유저 정보는 req.user 활용할 수 있습니다.
    req.user = user;
    next();
  } catch (error) {
    slack.slackWebhook(req, error.message);
    console.log(error);
    functions.logger.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, token);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

module.exports = { auth };
