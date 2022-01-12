const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getPhotoByStyle = async (client, styleId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Photo" p
      JOIN "Film" f  ON p.film_id = f.id
      WHERE f.style_id = $1
    `,
    [styleId]
  );
  return convertSnakeToCamel.keysToCamel( rows);
};


module.exports = { getPhotoByStyle };