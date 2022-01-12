const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const getPhotosByStyle = async (client, styleId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
      JOIN "Film" f  ON p.film_id = f.id
      WHERE f.style_id = $1
    `,
    [styleId]
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

module.exports = { getPhotosByStyle, getPhotosByFilm };