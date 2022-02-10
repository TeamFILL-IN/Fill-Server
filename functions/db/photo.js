const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 사진 조회
const getAllPhotos = async (client) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count, is_garo FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 최신순 사진 조회 ( 8개 )
const getLatestPhotos = async (client) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 8
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 필름 스타일별 사진 조회
const getPhotosByStyle = async (client, styleId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count, is_garo FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE f.style_id = $1
      ORDER BY p.created_at DESC
    `,
    [styleId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 필름별 사진 조회
const getPhotosByFilm = async (client, filmId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count, is_garo FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE film_id = $1
      ORDER BY p.created_at DESC
    `,
    [filmId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 특정 사진 조회
const getPhotoById = async (client, photoId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE p.id = $1
      ORDER BY p.created_at DESC
    `,
    [photoId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저별 게시 사진 조회
const getPhotosByUser = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE user_id = $1
      ORDER BY p.created_at DESC
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 큐레이션내 사진 조회
const getPhotosByCuration = async (client, photoList) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE p.id IN (${photoList.join()})
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 스튜디오 사진 조회
const getPhotosByStudio = async (client, studioId) => {
  const { rows } = await client.query(
    `
    SELECT s.name AS studio_name, u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      JOIN "Studio" s ON p.studio_id = s.id
      WHERE studio_id = $1
      ORDER BY p.created_at DESC
    `,
    [studioId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 사진 게시
const addPhoto = async (client, userId, filmId, studioId, imageUrl, isGaro) => {
  const { rows } = await client.query(
    `
    INSERT INTO "Photo"
    (user_id, film_id, studio_id, image_url, is_garo)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [userId, filmId, studioId, imageUrl, isGaro],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 좋아요 체크
const isLikedPhoto = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT user_id, photo_id FROM "Like" l
      WHERE user_id = $1
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const deletePhoto = async (client, photoId) => {
  const { rows } = await client.query(
    `
    DELETE FROM "Photo" p
    WHERE id = $1
    RETURNING *
    `,
    [photoId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updatePhoto = async (client, filmId, studioId, photoId) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE id = $1
    `,
    [photoId],
  );

  if (existingRows.length === 0) return false;

  const data = _.merge({}, convertSnakeToCamel.keysToCamel(existingRows[0]), { filmId, studioId });

  const { rows } = await client.query(
    `
    UPDATE "Photo" p
    SET film_id = $1, studio_id = $2, updated_at = now()
    WHERE id = $3
    RETURNING * 
    `,
    [data.filmId, data.studioId, photoId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { getAllPhotos, getLatestPhotos, getPhotosByStyle, getPhotosByFilm, getPhotoById, getPhotosByCuration, getPhotosByStudio, getPhotosByUser, addPhoto, isLikedPhoto, deletePhoto, updatePhoto };
