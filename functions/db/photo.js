const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 사진 조회
const getAllPhotos = async (client) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 필름 스타일별 사진 조회
const getPhotosByStyle = async (client, styleId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE f.style_id = $1
      AND p.is_deleted = FALSE
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
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE film_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
    `,
    [filmId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

// 특정 사진 조회
const getPhotoById = async (client, photoId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE p.id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
    `,
    [photoId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
}

// 유저별 게시 사진 조회
const getPhotosByUser = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE user_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotosByCuration = async (client, photoList) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE p.id IN (${photoList.join()})
      AND p.is_deleted = FALSE
    `
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotoByStudio = async (client, studioId) => {
  const { rows } = await client.query(
    `
    SELECT s.name AS studio_name, u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      JOIN "Studio" s ON p.studio_id = s.id
      WHERE studio_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
    `,
    [studioId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

// 사진 게시
const addPhoto = async (client, userId, filmId, studioId, imageUrl) => {
  const { rows } = await client.query(
    `
    INSERT INTO "Photo"
    (user_id, film_id, studio_id, image_url)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `,
    [userId, filmId, studioId, imageUrl]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
}

module.exports = { getAllPhotos, getPhotosByStyle, getPhotosByFilm, getPhotoById, getPhotosByCuration, getPhotoByStudio, getPhotosByUser, addPhoto };
