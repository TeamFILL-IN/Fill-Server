const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 모든 큐레이션 랜덤 조회
const getCuration = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Curation" c
    ORDER BY RANDOM() LIMIT 1
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 특정 큐레이션 조회
const getCurationById = async (client, curationId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "Curation" c
    WHERE id = $1
    `,
    [curationId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { getCuration, getCurationById };