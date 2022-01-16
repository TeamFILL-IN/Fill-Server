const functions = require('firebase-functions');
const jwt = require('jsonwebtoken');
const { TOKEN_INVALID, TOKEN_EXPIRED } = require('../constants/jwt');

const secretKey = process.env.JWT_SECRET;

const ac_options = {
  algorithm: process.env.JWT_ALGORITHM,
  expiresIn: process.env.JWT_AC_EXPIRES,
  issuer: process.env.JWT_ISSUER,
};

const rf_options = {
  algorithm: process.env.JWT_ALGORITHM,
  expiresIn: process.env.JWT_RF_EXPIRES,
  issuer: process.env.JWT_ISSUER,
};

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

  return decoded;
};

module.exports = {
  sign,
  verify,
  createRefresh,
};
