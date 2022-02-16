const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, require('./userGET'));
router.delete('/', auth, require('./userDELETE'));
router.put('/', auth, require('./userNicknamePUT'));
router.put('/camera', auth, require('./userCameraPUT'));
router.delete('/camera/:camera_index', auth, require('./userCameraDELETE'));

module.exports = router;
