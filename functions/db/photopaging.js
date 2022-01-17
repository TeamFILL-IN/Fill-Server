const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 사진 조회
const getAllPhotos = async (client, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE p.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET $1
    `,
    [photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 필름 스타일별 사진 조회
const getPhotosByStyle = async (client, styleId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE f.style_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [styleId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 필름별 사진 조회
const getPhotosByFilm = async (client, filmId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE film_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [filmId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

// 유저별 게시 사진 조회
const getPhotosByUser = async (client, userId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      WHERE user_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [userId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

// 스튜디오 사진 조회
const getPhotosByStudio = async (client, studioId, photoNum) => {
  const { rows } = await client.query(
    `
    SELECT s.name AS studio_name, u.nickname, u.image_url AS user_image_url, p.id AS photo_id, p.image_url, film_id, f.name AS film_name, like_count FROM "Photo" p
      JOIN "Film" f ON p.film_id = f.id
      JOIN "User" u ON p.user_id = u.id
      JOIN "Studio" s ON p.studio_id = s.id
      WHERE studio_id = $1
      AND p.is_deleted = FALSE
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET $2
    `,
    [studioId, photoNum],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

module.exports = { getAllPhotos, getPhotosByStyle, getPhotosByFilm, getPhotosByStudio, getPhotosByUser };
