const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const getAllUsers = async (client) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "User" u
    WHERE is_deleted = FALSE
    `,
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

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

const checkAlreadyUser = async (client, social, email) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "User" u
    WHERE social = $1 and email = $2
    `,
    [social, email],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

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

const addUser = async (client, social, email, nickname, refreshToken) => {
  const { rows } = await client.query(
    `
    INSERT INTO "User"
    (social, email, nickname, refresh_token)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `,

    [social, email, nickname, refreshToken],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { getAllUsers, getUserById, getUserByRfToken, checkAlreadyUser, getUserRefreshToken, updateIsDeleted, updateRefreshToken, deleteUser, addUser };
