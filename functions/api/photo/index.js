const express = require('express');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.get('/', auth, require('./photoAllGET'));
router.get('/film/style/:styleId', auth, require('./photoStyleGET'));
router.get('/film/:filmId', auth, require('./photoFilmGET'));
router.get('/:photoId', auth, require('./photoGET'));

module.exports = router;