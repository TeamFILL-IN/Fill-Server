const axios = require('axios');
const jwt = require('jsonwebtoken');
const { success, fail } = require('./util');
const sc = require('../constants/statusCode');
const rm = require('../constants/responseMessage');

const kakaoAuth = async (kakaoAccessToken) => {
  console.log('🔑 Kakao 토큰을 Kakao API server에 요청하여 유저 정보를 확인합니다.');

  try {
    const user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const kakaoUser = user.data.kakao_account;

    if (!kakaoUser.is_email_valid || !kakaoUser.is_email_verified) return null;

    return kakaoUser;
  } catch (err) {
    return null;
  }
};

const appleAuth = async (appleAccessToken) => {
  console.log('🔑 Apple 토큰을 해독하여 유저 정보를 확인합니다.');

  try {
    const appleUser = jwt.decode(appleAccessToken);

    if (!appleUser.email_verified) return null;

    return appleUser;
  } catch (err) {
    return null;
  }
};

module.exports = { kakaoAuth, appleAuth };
