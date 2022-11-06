const { app } = require('../../index');
const req = require('supertest');

describe('GET /studio', () => {
  test('근처 스튜디오 조회 테스트', async (done) => {
    const res = await req(app).get('/api/studio').set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { studios } = res.body.data;
    const { id, lati, long } = studios[0];

    expect(studios.length).toBeGreaterThanOrEqual(0);
    expect(id).toBeTruthy();
    expect(lati).toBeTruthy();
    expect(long).toBeTruthy();
    done();
  });
});
