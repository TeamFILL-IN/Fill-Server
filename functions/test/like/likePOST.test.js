const { app } = require('../../index');
const req = require('supertest');

describe('POST /like', () => {
  test('Response 테스트', async () => {
    const res = await req(app)
      .post(`/api/like`)
      .set('token', process.env.TEST_TOKEN)
      .send({ photoId: 5 });

    const { message, status, success } = res.body;
    expect(res.statusCode).toBe(200);
    expect(message).toEqual("좋아요 성공");
    expect(success).toEqual(true);
  });
});
