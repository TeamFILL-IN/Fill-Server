const { app } = require('../../index');
const req = require('supertest');

describe('POST /bookmark', () => {
  test('북마크 추가 및 삭제 테스트', async (done) => {
    const res = await req(app).post(`/api/bookmark`).set('token', process.env.TEST_TOKEN).send({ studioId: 1 });

    const { message, status, success } = res.body;
    expect(res.statusCode).toBe(200);
    expect(message).toBeTruthy();
    expect(success).toEqual(true);
    done();
  });
});
