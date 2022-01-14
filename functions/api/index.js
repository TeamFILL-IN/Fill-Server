const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));
router.use('/film', require('./film'));
router.use('/auth', require('./auth'));
router.use('/studio', require('./studio'));
router.use('/photo', require('./photo'));
router.use('/curation',require('./curation'));

module.exports = router;
