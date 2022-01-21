const { app } = require('../../index');
const req = require('supertest');

describe('POST /like', () => {
  test('좋아요 추가 및 삭제 테스트', async (done) => {
    const res = await req(app).post(`/api/like`).set('token', process.env.TEST_TOKEN).send({ photoId: 5 });

    const { message, status, success } = res.body;
    expect(res.statusCode).toBe(200);
    expect(message).toBeTruthy();
    expect(success).toEqual(true);
    done();
  });
});
