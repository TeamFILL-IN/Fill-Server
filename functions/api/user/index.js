const express = require('express');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, require('./userGET'));

module.exports = router;
