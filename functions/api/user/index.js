const express = require('express');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, require('./userGET'));
router.delete('/', auth, require('./userDELETE'));

module.exports = router;
