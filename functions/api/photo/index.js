const express = require('express');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, require('./photoAllGET'));
router.get('/film/style/:styleId', auth, require('./photoStyleGET'));

module.exports = router;