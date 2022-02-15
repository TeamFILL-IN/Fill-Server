const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 북마크 추가
const postBookmark = async (client, userId, studioId) => {
  const { rows } = await client.query(
    `
    INSERT INTO "Bookmark" 
    (user_id, studio_id)
    VALUES
    ($1, $2)
    RETURNING *
    `,
    [userId, studioId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 북마크 취소
const deleteBookmark = async (client, userId, studioId) => {
  const { rows } = await client.query(
    `
    DELETE FROM "Bookmark"
    WHERE user_id = $1
    AND studio_id = $2
    `,
    [userId, studioId],
  );
  return true;
};

// 북마크 유무 조회
const checkBookmark = async (client, userId, studioId) => {
  const { rows } = await client.query(
    `
    SELECT FROM "Bookmark"
    WHERE user_id = $1
    AND studio_id = $2
    `,
    [userId, studioId],
  );
  if(!rows[0]) return false
  else return true
};



module.exports = { postBookmark, deleteBookmark, checkBookmark }
