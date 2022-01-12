const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { userDB } = require('../../db');
const jwt = require('../../lib/jwt');
const nicknameGenerator = require('../../lib/nicknameGenerator');
const nicknameSet = require('../../constants/nicknameSet');
const { kakaoAuth, appleAuth } = require('../../lib/social');

module.exports = async (req, res) => {
  const { token, social } = req.body;

  if (!token || !social) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  const nickname = nicknameGenerator(nicknameSet);

  let client;

  try {
    const client = await db.connect();
    let user;
    let email = null;

    // TODO. apple token 인증
    switch (social) {
      case 'kakao':
        user = await kakaoAuth(token);
        break;
      case 'apple':
        user = await appleAuth(token);
        break;
    }

    if (!user) res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_SOCIAL));
    if (user.email) email = user.email;

    const existedUser = await userDB.checkAlreadyUser(client, social, email);

    if (!existedUser) {
      const { refreshToken } = jwt.createRefresh();
      const newUser = await userDB.addUser(client, social, email, nickname, refreshToken);
      const { accessToken } = jwt.sign(newUser);
      res.status(sc.CREATED).send(success(sc.CREATED, rm.CREATED_USER, { email, nickname, accessToken, refreshToken }));
    }

    const { refreshToken } = jwt.createRefresh();
    const { accessToken } = jwt.sign(existedUser);

    if (existedUser.isDeleted) await userDB.updateIsDeleted(client, existedUser.id);
    await userDB.updateRefreshToken(client, existedUser.id, refreshToken);

    res.status(sc.OK).send(success(sc.OK, rm.LOGIN_SUCCESS, { email, accessToken, refreshToken }));
  } catch (error) {
    console.log(error);
    functions.logger.error(`[EMAIL SIGNUP ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERR));
  } finally {
    client.release();
  }
};
