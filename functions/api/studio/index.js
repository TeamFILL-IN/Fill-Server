const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

//router.get('/', auth, require('./studioAllGET'));     //스튜디오 모든 정보
router.get('/', auth, require('./studioNearbyGET'));    //지도에서 보여지는 주변 스튜디오 위치정보
router.get('/search', auth, require('./studioSearchGET'));    //스튜디오 검색
router.get('/detail/:studioId', auth, require('./studioOneGET'));    //특정 스튜디오 상세 정보

module.exports = router;