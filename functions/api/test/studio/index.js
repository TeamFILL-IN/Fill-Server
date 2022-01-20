const express = require('express');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

//router.get('/', auth, require('./studioAllGET'));     
router.get('/', auth, require('./studioNearbyGET'));    
router.get('/search', auth, require('./studioSearchGET'));   
router.get('/detail/:studioId', auth, require('./studioOneGET'));

module.exports = router;