const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));
router.use('/film', require('./film'));
router.use('/auth', require('./auth'));
router.use('/photo',require('./photo'));

module.exports = router;
