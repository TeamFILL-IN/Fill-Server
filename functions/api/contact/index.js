const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth, require('./contactPOST'));
router.post('/new', auth, require('./contactNewPOST'));

module.exports = router;
