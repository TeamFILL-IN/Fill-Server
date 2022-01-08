const express = require('express');
const router = express.Router();

router.get('/', require('./userTEST'));

module.exports = router;
