const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, require('./curationGET'));    //랜덤 큐레이션
router.get('/detail/:curationId', auth, require('./curationOneGET'));    //특정 큐레이션

module.exports = router;