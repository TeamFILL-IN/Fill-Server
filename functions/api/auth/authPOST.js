const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { userDB } = require('../../db');
const jwt = require('../../lib/jwt');
const nicknameGenerator = require('../../lib/nicknameGenerator');
const nicknameSet = require('../../constants/nicknameSet');
const { kakaoAuth, appleAuth } = require('../../lib/social');
const { NOT_INCLUDE_EMAIL, INVALID_USER } = require('../../constants/social');
const { slack } = require('../../other/slack/slack');

/**
 * @소셜_로그인_회원가입
 * @desc 소셜 로그인 및 회원가입을 진행해요.
 */
module.exports = async (req, res) => {
  const { token, social } = req.body;

  if (!token || !social) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  const nickname = nicknameGenerator(nicknameSet);

  let client;

  try {
    const client = await db.connect();
    let user;
    let email = '';
    let type = 'Login';

    switch (social) {
      case 'kakao':
        user = await kakaoAuth(token);
        if (user === NOT_INCLUDE_EMAIL) email = '';
        if (user === INVALID_USER) res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_SOCIAL));
        break;
      case 'apple':
        user = await appleAuth(token);
        if (user.email) email = user.email;
        break;
    }

    if (!user) res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_SOCIAL));

    const existedUser = await userDB.checkAlreadyUser(client, social, email);

    if (!existedUser) {
      type = 'Signup';
      const { refreshToken } = jwt.createRefresh();
      const newUser = await userDB.addUser(client, social, email, nickname, refreshToken);
      const { accessToken } = jwt.sign(newUser);
      return res.status(sc.CREATED).send(success(sc.CREATED, rm.CREATED_USER, { type, email, nickname, accessToken, refreshToken }));
    }

    const { refreshToken } = jwt.createRefresh();
    const { accessToken } = jwt.sign(existedUser);

    if (existedUser.isDeleted) await userDB.updateIsDeleted(client, existedUser.id);
    await userDB.updateRefreshToken(client, existedUser.id, refreshToken);

    res.status(sc.OK).send(success(sc.OK, rm.LOGIN_SUCCESS, { type, email, accessToken, refreshToken }));
  } catch (error) {
    slack(req, error.message);
    console.log(error);
    functions.logger.error(`[EMAIL SIGNUP ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERR));
  } finally {
    client.release();
  }
};
