const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllPhotos = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE is_deleted = FALSE
      ORDER BY created_at DESC
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPhotosByStyle = async (client, styleId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
      JOIN "Film" f  ON p.film_id = f.id
      WHERE f.style_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
    `,
    [styleId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getPhotosByFilm = async (client, filmId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE film_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
    `,
    [filmId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotoById = async (client, photoId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [photoId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
}

const getPhotosByUser = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE user_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotoByCuration = async (client, photoList) => {
  const { rows } = await client.query(
    `
    SELECT id, image_url FROM "Photo" p
    WHERE id IN (${photoList.join()})
      AND is_deleted = FALSE
    `
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotoByStudio = async (client, studioId) => {
  const { rows } = await client.query(
    `
    SELECT id, image_url FROM "Photo" p
    WHERE studio_id = $1
      AND is_deleted = FALSE
      ORDER BY created_at DESC
    `,
    [studioId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

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

module.exports = { getAllPhotos, getPhotosByStyle, getPhotosByFilm, getPhotoById, getPhotoByCuration, getPhotoByStudio, getPhotosByUser, addPhoto };
