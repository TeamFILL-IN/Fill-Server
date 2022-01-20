const { app } = require('../../index');
const req = require('supertest');

describe('GET /curation/detail/:curationId', () => {
  test('Response 테스트', async (done) => {
    const curationId = 1;
    const res = await req(app).get(`/api/curation/detail/${curationId}`).set('token', process.env.TEST_TOKEN);

    expect(curationId).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    expect(res.body.data).toBeTruthy();

    const { curation, photos } = res.body.data;
    const { id, title, photoList } = curation;
    const { nickname, userImageUrl, photoId, imageUrl, filmId, filmName, likeCount, isLiked } = photos[0];

    expect(id).toBeTruthy();
    expect(title).toBeTruthy();
    expect(photoList).toBeTruthy();
    expect(photos.length).toBeLessThanOrEqual(8);
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
