const { app } = require('../../index');
const req = require('supertest');

describe('GET /film/:styleId', () => {
  test('스타일별 필름 조회 테스트', async (done) => {
    const style_id = 1;
    const res = await req(app).get(`/api/film/${style_id}`).set('token', process.env.TEST_TOKEN);

    expect(style_id).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { films } = res.body.data;
    const { id, name, styleId } = films[0];

    expect(id).toBeTruthy();
    expect(name).toBeTruthy();
    expect(styleId).toBeLessThanOrEqual(4);
    done();
  });
});
