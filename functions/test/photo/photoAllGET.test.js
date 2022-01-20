const { app } = require('../../index');
const req = require('supertest');

describe('GET /photo', () => {
  test('Response 테스트', async (done) => {
    const res = await req(app).get(`/api/photo`).set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { photos } = res.body.data;
    const { nickname, userImageUrl, photoId, imageUrl, filmId, filmName, likeCount, isLiked } = photos[0];

    expect(nickname).toBeTruthy();
    expect(userImageUrl).toBeTruthy();
    expect(photoId).toBeTruthy();
    expect(imageUrl).toBeTruthy();
    expect(filmId).toBeTruthy();
    expect(filmName).toBeTruthy();
    expect(likeCount).toBeGreaterThanOrEqual(0);
    expect(isLiked).not.toBeNull();
    done();
  });
});
