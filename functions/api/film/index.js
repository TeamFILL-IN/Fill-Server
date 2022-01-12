const express = require('express');
const {auth} = require('../../middlewares/auth');
const router = express.Router();

router.get('/:styleId', auth, require('./filmStyleGET'));

module.exports = router;
