const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const postLike = async (client, userId, photoId) => {
  const { rows } = await client.query(
    `
    INSERT INTO "Like" 
    (user_id, photo_id)
    VALUES
    ($1, $2)
    RETURNING *
    `,
    [userId, photoId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const deleteLike = async (client, userId, photoId) => {
  const { rows } = await client.query(
    `
    DELETE FROM "Like"
    WHERE user_id = $1
    AND photo_id = $2
    `,
    [userId, photoId],
  );
  return true;
};

const checkLike = async (client, userId, photoId) => {
  const { rows } = await client.query(
    `
    SELECT FROM "Like"
    WHERE user_id = $1
    AND photo_id = $2
    `,
    [userId, photoId],
  );
  if(!rows[0]) return false
  else return true
};



module.exports = { postLike, deleteLike, checkLike}
