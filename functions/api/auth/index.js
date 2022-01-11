const express = require('express');
const router = express.Router();

router.get('/refresh', require('./authRefreshGET'));
router.post('/signup', require('./authSignupPOST'));

module.exports = router;
