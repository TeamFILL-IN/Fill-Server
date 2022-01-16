const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, require('./curationGET'));
router.get('/detail/:curationId', auth, require('./curationOneGET'));

module.exports = router;