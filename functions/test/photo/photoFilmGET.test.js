const { app } = require('../../index');
const req = require('supertest');

describe('GET /photo/:filmId', () => {
  test('필름별 사진 조회 테스트', async (done) => {
    const film_id = 34;
    const res = await req(app).get(`/api/photo/film/${film_id}`).set('token', process.env.TEST_TOKEN);

    expect(film_id).toBeTruthy();
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
