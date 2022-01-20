const { app } = require('../../index');
const req = require('supertest');

describe('GET /photo/style', () => {
  test('필름 종류별 사진 조회 테스트', async () => {
    const style_id = 34;
    const res = await req(app).get(`/api/photo/style/${style_id}`).set('token', process.env.TEST_TOKEN);
    // expect([1, -2, 22]).toContain(someNumber);

    expect([200, 204]).toContain(res.statusCode);
    expect(res.body).toBeTruthy();
    if (res.statusCode == 200) {
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
    }
  });
});
