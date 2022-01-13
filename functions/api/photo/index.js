const express = require('express');
const { auth } = require('../../middlewares/auth');
const router = express.Router();
const uploadImage = require('../../middlewares/uploadImage')

router.get('/', auth, require('./photoAllGET'));
router.get('/film/style/:styleId', auth, require('./photoStyleGET'));
router.get('/film/:filmId', auth, require('./photoFilmGET'));
router.get('/:photoId', auth, require('./photoGET'));
router.get('/user/:userId', auth, require('./photoUserGET'));
router.get('/studio/:studioId', auth, require('./photoStudioGET'));

module.exports = router;