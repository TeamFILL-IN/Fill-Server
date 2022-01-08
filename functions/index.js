const admin = require('firebase-admin');
const serviceAccount = require('./fill-in-13efb-firebase-adminsdk-g93iy-d395b45dac.json');
const dotenv = require('dotenv');

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require('./api/v1'),
};
