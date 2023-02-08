const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const { slack } = require('../../other/slack/slack');
const { sendMail } = require('../../lib/mail');
/**
 * @제보하기
 * @desc 필름이나 스튜디오를 제보해요.
 */
module.exports = async (req, res) => {
  const { nickname } = req.user;
  const category = '제보하기';
  if (!nickname) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  const { content } = req.body;
  if (!content) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));

  try {
    await sendMail(category, content, nickname);
    res.status(sc.OK).send(success(sc.OK, rm.SEND_OP_SUCCESS));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};
