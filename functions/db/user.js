const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

// 전체 유저 조회
const getAllUsers = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "User" u
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

// Id로 특정 유저 조회
const getUserById = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "User" u
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// refreshToken으로 특정 유저 조회
const getUserByRfToken = async (client, refreshToken) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "User" u
    WHERE refresh_token = $1
      AND is_deleted = FALSE
    `,
    [refreshToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 존재 유무 판별
const checkAlreadyUser = async (client, social, idKey) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "User" u
    WHERE social = $1 and id_key = $2
    `,
    [social, idKey],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 특정 유저 refreshToken 조회
const getUserRefreshToken = async (client, userId) => {
  const { rows } = await client.query(
    `
    SELECT refresh_token FROM "User" u
    WHERE user_id = $1
      AND is_deleted = FALSE
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 재가입
const updateIsDeleted = async (client, userId) => {
  const { rows } = await client.query(
    `
    UPDATE "User" u
    SET is_deleted = FALSE, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 refreshToken 업데이트
const updateRefreshToken = async (client, userId, refreshToken) => {
  const { rows } = await client.query(
    `
    UPDATE "User" u
    SET refresh_token = $2, updated_at = now()
    WHERE id = $1
    RETURNING * 
    `,
    [userId, refreshToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 특정 유저 삭제
const deleteUser = async (client, userId) => {
  const { rows } = await client.query(
    `
    UPDATE "User" u
    SET is_deleted = TRUE, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(rows[0]);
};

// 유저 가입
const addUser = async (client, social, email, nickname, refreshToken, idKey) => {
  const { rows } = await client.query(
    `
    INSERT INTO "User"
    (social, email, nickname, refresh_token, id_key)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
    `,

    [social, email, nickname, refreshToken, idKey],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateUserNickname = async (client, userId, nickname) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "User"
    WHERE id = $1
       AND is_deleted = FALSE
    `,
    [userId],
  );

  if (existingRows.length === 0) return false;

  const { rows } = await client.query(
    `
    UPDATE "User" u
    SET nickname = $2, updated_at = now()
    WHERE id = $1
    RETURNING * 
    `,
    [userId, nickname],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const updateUserCamera = async (client, userId, camera) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "User"
    WHERE id = $1
       AND is_deleted = FALSE
    `,
    [userId],
  );

  if (existingRows.length === 0) return false;

  const { rows } = await client.query(
    `
    UPDATE "User" u
    SET camera = array_append(camera,$2), updated_at = now()
    WHERE id = $1
    RETURNING * 
    `,
    [userId, camera],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const deleteUserCamera = async (client, userId, camera_index) => {
  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "User"
    WHERE id = $1
       AND is_deleted = FALSE
    `,
    [userId],
  );

  if (existingRows.length === 0) return false;

  const { rows } = await client.query(
    `
    UPDATE "User" u
    SET camera = array_remove(camera,camera[$2]), updated_at = now()
    WHERE id = $1
    RETURNING * 
    `,
    [userId, Number(camera_index)],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByRfToken,
  checkAlreadyUser,
  getUserRefreshToken,
  updateIsDeleted,
  updateRefreshToken,
  deleteUser,
  addUser,
  updateUserNickname,
  updateUserCamera,
  deleteUserCamera,
};
