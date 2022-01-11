const axios = require('axios');

const kakaoAuth = async (kakaoAccessToken) => {
  console.log('🔑 Kakao 토큰을 Kakao API server에 요청하여 확인합니다.');

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
};

module.exports = { kakaoAuth };
