const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));
router.use('/film', require('./film'));
router.use('/auth', require('./auth'));
router.use('/studio', require('./studio'));
router.use('/photo', require('./photo'));
router.use('/photoaging', require('./photopaging'))
router.use('/curation',require('./curation'));
router.use('/like',require('./like'));

module.exports = router;
