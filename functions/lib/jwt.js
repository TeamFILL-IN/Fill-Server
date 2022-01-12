const functions = require('firebase-functions');
const jwt = require('jsonwebtoken');
const { TOKEN_INVALID, TOKEN_EXPIRED } = require('../constants/jwt');

// secretKey
const secretKey = process.env.JWT_SECRET;

// access_token option 세팅
const ac_options = {
  algorithm: 'HS256',
  expiresIn: '1h',
  issuer: 'fillin',
};

// refresh_token option 세팅
const rf_options = {
  algorithm: 'HS256',
  expiresIn: '14d',
  issuer: 'fillin',
};

// id, email, name, idFirebase가 담긴 JWT를 발급합니다.
const sign = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const result = {
    accessToken: jwt.sign(payload, secretKey, ac_options),
  };
  return result;
};

const createRefresh = () => {
  const result = {
    refreshToken: jwt.sign({}, secretKey, rf_options),
  };
  return result;
};

// JWT를 해독하고, 해독한 JWT가 우리가 만든 JWT가 맞는지 확인합니다 (인증).
const verify = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, secretKey);
  } catch (err) {
    if (err.message === 'jwt expired') {
      console.log('만료된 토큰입니다.');
      functions.logger.error('만료된 토큰입니다.');
      return TOKEN_EXPIRED;
    }
    if (err.message === 'invalid signature') {
      console.log('유효하지 않은 토큰입니다.');
      functions.logger.error('유효하지 않은 토큰입니다.');
      return TOKEN_INVALID;
    }
    console.log('유효하지 않은 토큰입니다.');
    functions.logger.error('유효하지 않은 토큰입니다.');
    return TOKEN_INVALID;
  }
  // 해독 / 인증이 완료되면, 해독된 상태의 JWT를 반환합니다.
  return decoded;
};

module.exports = {
  sign,
  verify,
  createRefresh,
};