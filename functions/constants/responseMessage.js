module.exports = {
  NULL_VALUE: '필요한 값이 없습니다',
  OUT_OF_VALUE: '파라미터 값이 잘못되었습니다',
  NOT_FOUND: '잘못된 경로입니다',

  // 회원가입
  CREATED_USER: '회원 가입 성공',
  DELETE_USER: '회원 탈퇴 성공',
  ALREADY_USER: '이미 가입된 이메일입니다.',

  // 로그인
  LOGIN_SUCCESS: '로그인 성공',
  LOGIN_FAIL: '로그인 실패',
  MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',
  INVALID_EMAIL: '이메일 형식을 확인해주세요.',

  // 소셜
  UNAUTHORIZED_SOCIAL: '유효하지 않은 소셜 유저/토큰입니다.',

  // 프로필 조회
  READ_PROFILE_SUCCESS: '프로필 조회 성공',

  // 필름 조회
  INVALID_STYLE_ID: '잘못된 스타일 아이디입니다.',
  READ_FILMS_OF_STYLE_SUCCESS: '스타일 별 필름 조회 성공',

  // 사진
  NO_PHOTO: '사진이 존재하지 않습니다',
  READ_ALL_PHOTOS_SUCCESS: '모든 사진 조회 성공',
  READ_LATEST_PHOTOS_SUCCESS: '최신순 사진 조회 성공',
  READ_PHOTO_SUCCESS: '사진 조회 성공',
  READ_PHOTOS_OF_USER_SUCCESS: '유저 사진 조회 성공',
  NO_PHOTO_OF_STYLE_EXIST: '해당 종류의 사진이 존재하지 않습니다',
  READ_PHOTOS_OF_STYLE_SUCCESS: '스타일별 사진 조회 성공',
  NO_PHOTO_OF_FILM_EXIST: '해당 필름의 사진이 존재하지 않습니다',
  READ_PHOTOS_OF_FILM_SUCCESS: '필름별 사진 조회 성공',
  ADD_PHOTO_SUCCESS: '사진 게시 성공',
  NO_PHOTO_OF_STUDIO_EXIST: '해당 스튜디오의 사진이 존재하지 않습니다',
  READ_PHOTOS_OF_STUDIO_SUCCESS: '스튜디오별 사진 조회 성공',
  READ_MYPAGE_PHOTO_SUCCESS: '마이페이지 사진 조회 성공',

  // 유저
  READ_ONE_USER_SUCCESS: '유저 조회 성공',
  READ_ALL_USERS_SUCCESS: '모든 유저 조회 성공',
  UPDATE_ONE_USER_SUCCESS: '유저 수정 성공',
  DELETE_ONE_USER_SUCCESS: '유저 삭제 성공',
  NO_USER: '탈퇴했거나 존재하지 않는 유저입니다',

  // 포스트
  ADD_ONE_POST_SUCCESS: '포스트 추가 성공',
  READ_ONE_POST_SUCCESS: '포스트 조회 성공',
  READ_ALL_POSTS_SUCCESS: '모든 포스트 조회 성공',
  UPDATE_ONE_POST_SUCCESS: '포스트 수정 성공',
  DELETE_ONE_POST_SUCCESS: '포스트 삭제 성공',
  NO_POST: '존재하지 않는 포스트입니다.',

  // 스튜디오
  READ_ONE_STUDIO_SUCCESS: '스튜디오 조회 성공',
  READ_ALL_STUDIO_SUCCESS: '모든 스튜디오 조회 성공',
  NO_STUDIO: '존재하지 않는 스튜디오입니다',

  // 검색
  NO_KEYWORD: '키워드가 없습니다, 키워드를 입력해주세요',

  // 큐레이션
  READ_RAND_CURATION_SUCCESS: '큐레이션 랜덤 조회 성공',
  READ_ONE_CURATION_SUCCESS: '특정 큐레이션 조회 성공',
  NO_CURATION: '존재하지 않는 큐레이션입니다',

  //좋아요(하트)
  ADD_LIKE_SUCCESS: '좋아요 성공',
  DELETE_LIKE_SUCCESS: '좋아요 취소',

  // 서버 내 오류
  INTERNAL_SERVER_ERROR: '서버 내 오류',

  // 토큰
  TOKEN_EXPIRED: '토큰이 만료되었습니다',
  ALL_TOKEN_EXPIRED: '모든 토큰이 만료되었습니다. 재로그인 또는 회원가입을 진행해주세요',
  TOKEN_INVALID: '토큰이 유효하지 않습니다',
  TOKEN_EMPTY: '토큰이 없습니다',
  TOKEN_VALID: '토큰이 유효합니다',
  CREATE_TOKEN: '토큰 재발급 성공',

  // 인증
  NO_AUTH_HEADER: 'Authorization 헤더가 없습니다.',
};
