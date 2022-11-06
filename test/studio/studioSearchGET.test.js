const { app } = require('../../index');
const req = require('supertest');

describe('GET /studio', () => {
  test('근처 스튜디오 조회 테스트', async (done) => {
    const url = `/api/studio/search?keyword=강남`;
    const res = await req(app).get(encodeURI(url)).set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { studios } = res.body.data;
    expect(studios.length).toBeGreaterThanOrEqual(0);

    const { id, name, address } = studios[0];

    expect(id).toBeTruthy();
    expect(name).toBeTruthy();
    expect(address).toBeTruthy();
    done();
  });
});
