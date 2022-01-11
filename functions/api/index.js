const express = require('express');

const router = express.Router();

router.use('/user', require('./user'));
router.use('/film', require('./film'));
router.use('/auth', require('./auth'));

module.exports = router;
