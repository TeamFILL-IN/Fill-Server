// 각종 모듈들
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const helmet = require('helmet');
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

// dotenv.config();

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

app.use('/', require('./api/routes'));

app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: '잘못된 경로입니다.',
  });
});

exports.app = functions
  .runWith({
    timeoutSeconds: 300, // 요청을 처리하는 과정이 300초를 초과하면 타임아웃 시키기
    memory: '512MB', // 서버에 할당되는 메모리
  })
  .region('asia-northeast3')
  .https.onRequest(app);
// exports.app = functions
//   .runWith({
//     timeoutSeconds: 300, // 요청을 처리하는 과정이 300초를 초과하면 타임아웃 시키기
//     memory: '512MB', // 서버에 할당되는 메모리
//   })
//   .region('asia-northeast3')
//   .https.onRequest(async (req, res) => {
//     // 들어오는 요청에 대한 로그를 콘솔에 찍기. 디버깅 때 유용하게 쓰일 예정.
//     // TODO. 콘솔 수정하기
//     console.log(
//       '\n\n',
//       '[api]',
//       `[${req.method.toUpperCase()}]`,
//       req.originalUrl,
//       `[${req.method}] ${!!req.user ? `${req.user.id}` : ``} ${req.originalUrl}\n ${!!req.query && `query: ${JSON.stringify(req.query)}`} ${!!req.params && `params ${JSON.stringify(req.params)}`}`,
//     );

//     return app(req, res);
//   });

// module.exports = {
//   api: require('./api'),
// };
