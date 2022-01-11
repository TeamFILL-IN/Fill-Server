const express = require('express');
const router = express.Router();

router.get('/:styleId', require('./filmStyleGET'));

module.exports = router;
