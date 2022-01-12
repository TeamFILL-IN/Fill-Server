const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 스튜디오 모든 정보
const getAllStudio = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Studio" u
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// 특정 스튜디오 정보
const getStudioById = async (client, studioId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Studio" u
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [studioId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 지도에서 보여지는 주변 스튜디오 위치정보
const getNearbyStudio = async (client) => {
  const { rows } = await client.query(
    `
    SELECT id,lati,long FROM "Studio" u
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getAllStudio, getStudioById, getNearbyStudio};