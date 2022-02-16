const express = require('express');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.post('/', auth, require('./bookmarkPOST'));

module.exports = router;
