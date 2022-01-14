// 각종 모듈들
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('./fill-in-13efb-firebase-adminsdk-g93iy-d395b45dac.json')
const { fail } = require('./lib/util');
const sc = require('./constants/statusCode');
const rm = require('./constants/responseMessage');

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

// initializing
const app = express();
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(hpp());
  app.use(helmet());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', require('./api'));

app.use('*', (req, res) => {
  res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.NOT_FOUND));
});

exports.app = functions
  .runWith({
    timeoutSeconds: 300, // 요청을 처리하는 과정이 300초를 초과하면 타임아웃 시키기
    memory: '512MB', // 서버에 할당되는 메모리
  })
  .https.onRequest(app);
