const { app } = require('../../index');
const req = require('supertest');

describe('GET /curation', () => {
  test('Response 테스트', async () => {
    const res = await req(app)
      .get('/api/curation')
      .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOm51bGwsImlhdCI6MTY0MjY1MDU5NCwiZXhwIjoxNjQzODYwMTk0LCJpc3MiOiJmaWxsaW4ifQ.8yUvS3jZ3Zur6nnDqA0g1Afg1BpsTpHc6UZP3flRW3A');

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
  });
});
