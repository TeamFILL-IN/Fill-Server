const axios = require('axios');
const jwt = require('jsonwebtoken');
const { NOT_INCLUDE_EMAIL, INVALID_USER } = require('../constants/social');

const kakaoAuth = async (kakaoAccessToken) => {
  console.log('๐ Kakao ํ ํฐ์ Kakao API server์ ์์ฒญํ์ฌ ์ ์  ์ ๋ณด๋ฅผ ํ์ธํ ๊ฒ์.');

  try {
    const user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    const kakaoUser = user.data.kakao_account;

    if (!kakaoUser) return NOT_INCLUDE_EMAIL;
    if (!kakaoUser.is_email_valid || !kakaoUser.is_email_verified) return INVALID_USER;

    return kakaoUser;
  } catch (err) {
    return null;
  }
};

const appleAuth = async (appleAccessToken) => {
  console.log('๐ Apple ํ ํฐ์ ํด๋ํ์ฌ ์ ์  ์ ๋ณด๋ฅผ ํ์ธํฉ๋๋ค.');

  try {
    const appleUser = jwt.decode(appleAccessToken);
    if (appleUser.email_verified == 'false') return null;

    return appleUser;
  } catch (err) {
    return null;
  }
};

module.exports = { kakaoAuth, appleAuth };
