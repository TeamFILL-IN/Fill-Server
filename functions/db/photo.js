const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllPhotos = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
    WHERE is_deleted = FALSE
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
    `,
    [filmId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
}

const getPhotoById = async (client, photoId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
      WHERE id = $1
    `,
    [photoId]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
}


module.exports = { getAllPhotos, getPhotosByStyle, getPhotosByFilm, getPhotoById };