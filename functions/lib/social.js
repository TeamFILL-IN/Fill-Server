const axios = require('axios');
const verifyAppleToken = require('verify-apple-id-token');
const { success, fail } = require('./util');
const sc = require('../constants/statusCode');
const rm = require('../constants/responseMessage');

const kakaoAuth = async (kakaoAccessToken) => {
  console.log('🔑 Kakao 토큰을 Kakao API server에 요청하여 확인합니다.');

  try {
    const user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const kakaoUser = user.data.kakao_account;

    if (!kakaoUser.is_email_valid || !kakaoUser.is_email_verified || !kakaoUser.email) return null;

    return kakaoUser;
  } catch (err) {
    return null;
  }
};

const appleAuth = async (appleAccessToken) => {
  console.log('🔑 Apple 토큰을 Apple API server에 요청하여 확인합니다.');

  try {
    const user = await verifyAppleToken({
      idToken: appleAccessToken,
      clientId: 'yourAppleClientId',
    });

    console.log(user);
  } catch (err) {
    return null;
  }
};

module.exports = { kakaoAuth };
