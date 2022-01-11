const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { userDB } = require('../../db');
const jwt = require('../../lib/jwt');
const { TOKEN_INVALID, TOKEN_EXPIRED } = require('../../constants/jwt');

module.exports = async (req, res) => {
  const { accesstoken, refreshtoken } = req.headers;
  // accessToken이 없을 시의 에러 처리입니다.
  if (!accesstoken || !refreshtoken) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.TOKEN_EMPTY));

  let client;

  try {
    client = await db.connect(req);

    // jwt를 해독하고 인증 절차를 거칩니다.
    const decodedToken = jwt.verify(accesstoken);

    if (decodedToken === TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));

    if (decodedToken === TOKEN_EXPIRED) {
      const refresh = jwt.verify(refreshtoken);

      if (refresh === TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));
      if (refresh === TOKEN_EXPIRED) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.ALL_TOKEN_EXPIRED));
      // ac token 만료, rf token 유효
      const user = await userDB.getUserByRfToken(client, refreshtoken);
      const { accessToken } = jwt.sign(user);

      return res.status(sc.OK).send(success(sc.OK, rm.CREATE_TOKEN, { accessToken, refreshtoken }));
    }
    // ac token 유효
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.TOKEN_VALID));
  } catch (error) {
    console.log(error);
    functions.logger.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accesstoken);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
