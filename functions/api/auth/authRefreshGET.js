const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { userDB } = require('../../db');
const jwt = require('../../lib/jwt');

module.exports = async (req, res) => {
  const { accessToken, refreshToken } = req.headers;

  // accessToken이 없을 시의 에러 처리입니다.
  if (!accessToken || !refreshToken) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.TOKEN_EMPTY));

  let client;

  try {
    client = await db.connect(req);

    // jwt를 해독하고 인증 절차를 거칩니다.
    const decodedToken = jwt.verify(accessToken);
    if (decodedToken === TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));

    const refresh = jwt.verifyRefresh(refreshToken, decodedToken.id);

    if (decodedToken === TOKEN_EXPIRED) {
      if (refresh === false) {
        // ac token 만료, rf token 만료
        return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.ALL_TOKEN_EXPIRED));
      } else {
        //ac token 만료, rf token 유효
        const newAccessToken = jwt.sign(user);
        return res.status(sc.OK).send(success(sc.OK, rm.CREATE_TOKEN, { newAccessToken, refreshToken }));
      }
    } else {
      // ac token 유효
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.TOKEN_VALID));
    }
  } catch (error) {
    console.log(error);
    functions.logger.error(`[AUTH ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, accessToken);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
