const express = require('express');
const router = express.Router();

router.get('/', require('./userGET'));

module.exports = router;
