const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 스튜디오 조회
const getAllStudio = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Studio" s
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 특정 스튜디오 조회
const getStudioById = async (client, studioId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Studio" s
    WHERE id = $1  
      AND is_deleted = FALSE
    `,
    [studioId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 주변 스튜디오 위치 조회
const getNearbyStudio = async (client) => {
  const { rows } = await client.query(
    `
    SELECT id,lati,long FROM "Studio" s
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 스튜디오 검색
const searchStudio = async (client, keyword) => {
  const { rows } = await client.query(
    `
    SELECT id,name,address FROM "Studio" s
    WHERE name LIKE '%${keyword}%' OR address LIKE '%${keyword}%';
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

//북마크한 스튜디오 전체 조회
const getBookmarkStudio = async (client) => {
  const { rows } = await client.query(
    `
    SELECT s.id, s.name, s.address FROM "Studio" s
      JOIN "Bookmark" b ON s.id = b.studio_id 
      JOIN "User" u ON u.id = b.user_id
      ORDER BY b.id DESC
      `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getAllStudio, getStudioById, getNearbyStudio, searchStudio, getBookmarkStudio};