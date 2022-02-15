const { app } = require('../../index');
const req = require('supertest');

describe('GET /studio', () => {
  test('북마크한 스튜디오 조회 테스트', async (done) => {
    const res = await req(app).get('/api/studio/bookmark').set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { studios } = res.body.data;
    const { id, name, address } = studios[0];

    expect(studios.length).toBeGreaterThanOrEqual(0);
    expect(id).toBeTruthy();
    expect(name).toBeTruthy();
    expect(address).toBeTruthy();
    done();
  });
});
