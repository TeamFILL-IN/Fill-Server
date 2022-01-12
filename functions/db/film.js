const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getFilmsByStyle = async (client,styleId) => {
  const { rows } = await client.query(
    `
    SELECT id, name, style_id FROM "Film" f
    WHERE style_id = $1
    `,
    [styleId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getFilmsByStyle }