const { app } = require('../../index');
const req = require('supertest');

describe('GET /studio', () => {
  test('근처 스튜디오 조회 테스트', async () => {
    const studio_id = 1;
    const res = await req(app).get(`/api/studio/detail/${studio_id}`).set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { studio } = res.body.data;
    expect(studio).toBeTruthy();

    const { id, name, address, price, time, tel, lati, long, etc, isDeleted, site } = studio;

    expect(id).toBeTruthy();
    expect(name).toBeTruthy();
    expect(address).toBeTruthy();
    expect(price).toBeTruthy();
    expect(time).toBeTruthy();
    expect(tel).toBeTruthy();
    expect(lati).toBeTruthy();
    expect(long).toBeTruthy();
    expect(isDeleted).not.toBeNull();
    expect(site).toBeTruthy();
  });
});
