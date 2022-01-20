const { app } = require('../../index');
const req = require('supertest');

describe('GET /photo/studio', () => {
  test('스튜디오 별 사진 조회 테스트', async () => {
    const studio_id = 44;
    const res = await req(app).get(`/api/photo/studio/${studio_id}`).set('token', process.env.TEST_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { photos } = res.body.data;
    expect(photos.length).toBeGreaterThanOrEqual(0);

    const { nickname, userImageUrl, photoId, imageUrl, filmId, filmName, likeCount, isLiked } = photos[0];

    expect(nickname).toBeTruthy();
    expect(userImageUrl).toBeTruthy();
    expect(photoId).toBeTruthy();
    expect(imageUrl).toBeTruthy();
    expect(filmId).toBeTruthy();
    expect(filmName).toBeTruthy();
    expect(likeCount).toBeGreaterThanOrEqual(0);
    expect(isLiked).not.toBeNull();
  });
});
