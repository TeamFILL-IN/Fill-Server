<!-- @format -->

## Fill - in your film, FILL-IN Server

> SOPT 29th APPJAM - TEAM FILL-IN ✨
> 2022.01.02 ~

<img src="https://user-images.githubusercontent.com/54793607/148735296-5a950533-8031-43ab-bd2b-841a3c4c6914.jpg">

<p align="center">
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FTeamFILL-IN%2FFill-Server&count_bg=%23000000&title_bg=%23FFB300&icon=googlelens.svg&icon_color=%23000000&title=FILLIN&edge_flat=true"/></a>
</p>

<br>

## 🍕 FILL-IN Server

|                                            [권세훈](https://github.com/devkwonsehoon)                                            |                                             [한수아](https://github.com/sssua-0928)                                              |                                             [서호영](https://github.com/tkarndbrtk)                                              |
| :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://user-images.githubusercontent.com/54793607/148734725-b1801e5a-e4dd-4377-9018-054ee6f49ae9.png" height="250" /> | <img src="https://user-images.githubusercontent.com/54793607/148734730-2989e023-6d4c-4972-a3d5-11cd728470e8.png" height="250" /> | <img src="https://user-images.githubusercontent.com/54793607/148734738-95e13cda-e61e-482f-8664-141e616b4519.png" height="250" /> |

<Hr>
<br>

## 🦖 Our Convention

- [Coding convention](https://www.notion.so/Coding-Convention-32799e14bed64821aefc868dae3d5c1a)
- [Commit convention](https://www.notion.so/Commit-Convention-7560cf1600634dfc927fff5ef979d636)
- [Git convention](https://www.notion.so/Git-Convention-46716db48d6e4d38a290775b72263c51)

<br>
<Hr>

## 🦖 Our API Docs

### 👉 [FILL-IN API Docs](https://66jxndoe.notion.site/FILL-IN-API-Docs-172e0ce525354888a81ff21acac6ac9e)

<br>
<Hr>

## 🦖 Our functions

|   func   |               detail               | developer | done |
| :------: | :--------------------------------: | :-------: | :--: |
|   Auth   |       구글, 애플 소셜 로그인       |   세훈    |  ✅  |
|          |      구글, 애플 소셜 회원가입      |   세훈    |  ✅  |
|          | refresh token을 이용한 토큰 재발급 |   세훈    |  ✅  |
|   User   |            내 정보 조회            |   세훈    |  ✅  |
|          |             회원 탈퇴              |   세훈    |  ✅  |
|  Studio  |       전체 스튜디오 조회하기       |   수아    |  ✅  |
|          |         스튜디오 검색하기          |   수아    |  ✅  |
|          |  특정 스튜디오 상세 정보 조회하기  |   수아    |  ✅  |
|  Photo   |         전체 사진 조회하기         |   세훈    |  ✅  |
|          |  본인이 게시한 전체 사진 조회하기  |   호영    |  ✅  |
|          |    특정 사진 상세 정보 조회하기    |   호영    |  ✅  |
|          |        필름별 사진 조회하기        |   호영    |  ✅  |
|          |     필름 종류별 사진 조회하기      |   호영    |  ✅  |
|          |      스튜디오별 사진 조회하기      |   수아    |  ✅  |
|          |  특정 유저별 게시된 사진 조회하기  |   수아    |  ✅  |
|          |          사진 업로드하기           |   호영    |  ✅  |
|   Film   |          종류별 필름 조회          |   호영    |  ✅  |
| Curation |      특정 큐레이션 사진 조회       |   수아    |  ✅  |

<br>

## 🦖 Our ERD

<img src="https://user-images.githubusercontent.com/54793607/148735695-1e9df66c-a9f9-4a87-b8d0-2354ce5bed78.png">

<br>

## 🦖 Our Directory Tree

```bash
├── README.md
├── firebase.json
├── .github
│   ├── workflows
│   │   ├── fill-in-cicd.yml
│   │   └── fill-in-pr-check.yml
└── functions
    ├── api
    │   ├── index.js
    │   └── user
    │       └── index.js
    ├── config
    ├── constants
    ├── db
    ├── FILL-IN-FIREBASE-ADMIN-KEY.json
    ├── index.js
    ├── lib
    ├── middlewares
    ├── package-lock.json
    └── package.json
```

<br>

## 🦖 Our Dependencies

```json
{
  "name": "functions",
  "description": "FILL-IN Server",
  "scripts": {
    "lint": "eslint .",
    "serve": "cross-env NODE_ENV=development firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "cross-env NODE_ENV=production firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "16"
  },
  "main": "index.js",
  "dependencies": {
    "busboy": "^0.3.1",
    "cookie-parser": "^1.4.5",
    "cors": "^2.8.5",
    "cross-env": "^7.0.3",
    "dayjs": "^1.10.7",
    "dotenv": "^10.0.0",
    "eslint-config-prettier": "^8.3.0",
    "express": "^4.17.1",
    "firebase": "^9.5.0",
    "firebase-admin": "^9.2.0",
    "firebase-functions": "^3.11.0",
    "helmet": "^4.6.0",
    "hpp": "^0.2.3",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.21",
    "multer": "^1.4.3",
    "pg": "^8.7.1"
  },
  "devDependencies": {
    "eslint": "^7.6.0",
    "eslint-config-google": "^0.14.0",
    "firebase-functions-test": "^0.2.0"
  },
  "private": true
}
```
