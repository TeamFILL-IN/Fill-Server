const express = require('express');
const router = express.Router();

router.get('/token', require('./authTokenGET'));
router.post('/', require('./authPOST'));

module.exports = router;
