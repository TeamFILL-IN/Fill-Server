const express = require('express');
const { auth } = require('../../middlewares/auth');
const uploadImage = require('../../middlewares/uploadImage');

const router = express.Router();

router.get('/', auth, require('./photoAllGET'));
router.get('/latest', auth, require('./photoLatestGET'));
router.get('/style/:styleId', auth, require('./photoStyleGET'));
router.get('/film/:filmId', auth, require('./photoFilmGET'));
router.get('/user', auth, require('./photoMyGET'));
router.get('/user/:userId', auth, require('./photoUserGET'));
router.get('/:photoId', auth, require('./photoGET'));
router.get('/studio/:studioId', auth, require('./photoStudioGET'));
router.post('/', auth, uploadImage, require('./photoPOST'));
router.delete('/:photoId', auth, require('./photoDELETE'));
router.put('/:photoId', auth, require('./photoPUT'));
module.exports = router;
