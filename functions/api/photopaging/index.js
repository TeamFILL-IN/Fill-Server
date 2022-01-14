const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, require('./photoAllGET'));
router.get('/style/:styleId', auth, require('./photoStyleGET'));
router.get('/film/:filmId', auth, require('./photoFilmGET'));
router.get('/user/:userId', auth, require('./photoUserGET'));
router.get('/studio/:studioId', auth, require('./photoStudioGET'));

module.exports = router;