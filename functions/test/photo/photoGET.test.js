const { app } = require('../../index');
const req = require('supertest');

describe('GET /photo/:photoId', () => {
  test('Response 테스트', async (done) => {
    const photo_id = 10;
    const res = await req(app).get(`/api/photo/${photo_id}`).set('token', process.env.TEST_TOKEN);

    expect(photo_id).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();

    const { nickname, userImageUrl, photoId, imageUrl, filmId, filmName, likeCount, isLiked } = res.body.data;

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
