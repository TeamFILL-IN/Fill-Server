const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/studio', require('./studio'));

module.exports = router;
