// 각종 모듈들
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('./fill-in-13efb-firebase-adminsdk-g93iy-d395b45dac.json');
const { fail } = require('./lib/util');
const sc = require('./constants/statusCode');
const rm = require('./constants/responseMessage');
const { slack } = require('./other/slack/slack');

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

const app = express();
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(hpp());
  app.use(helmet());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.disable('etag');
app.set('etag', false);

app.use('/api', require('./api'));

app.use('*', (req, res, error) => {
  slack(req, error.message);
  res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
});

exports.app = functions
  .region('asia-northeast3')
  .runWith({
    timeoutSeconds: 120,
    memory: '1GB',
  })
  .https.onRequest(app);
