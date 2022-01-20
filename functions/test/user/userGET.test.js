const { app } = require('../../index');
const req = require('supertest');

describe('GET /user', () => {
  test('유저 정보 테스트', async (done) => {
    const res = await req(app).get('/api/user').set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { user } = res.body.data;
    const { id, social, nickname, imageUrl, refreshToken, isDeleted, updatedAt, email, createdAt, idKey } = user;

    expect(id).toBe(2);
    expect(social).toBe('kakao');
    expect(nickname).toBe('따듯한 상어');
    expect(imageUrl).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    expect(isDeleted).not.toBeNull();
    expect(updatedAt).toBeTruthy();
    expect(email).toBeNull();
    expect(createdAt).toBeTruthy();
    expect(idKey).toBeTruthy();
    done();
  });
});
