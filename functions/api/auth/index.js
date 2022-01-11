const express = require('express');

const router = express.Router();

router.get('/refresh', require('./authRefreshGET'));
router.post('/', require('./authPOST'));

module.exports = router;
