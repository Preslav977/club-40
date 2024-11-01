const pool = require("./pool");

async function getUser(id) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    return rows[0];
  } catch (err) {
    console.error("Error when trying to query user by ID", err);
    throw err;
  }
}

async function postCreateUser(
  first_name,
  last_name,
  email,
  password,
  confirm_password,
  membership_status
) {
  try {
    const query = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, confirm_password, membership_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        first_name,
        last_name,
        email,
        password,
        confirm_password,
        membership_status,
      ]
    );

    return query.rows[0];
  } catch (err) {
    console.error("Error when creating the user", err);
    throw err;
  }
}

async function postBecomeMember(membership_status, id, user_id) {
  try {
    const query = await pool.query(
      "UPDATE users SET membership_status = $1 WHERE id IN (SELECT user_id FROM messages WHERE $2 = $3)",
      // "UPDATE users SET membership_status = $1 WHERE id = $2",
      [membership_status, id, user_id]
    );

    return query.rows[0];
  } catch (err) {
    console.error("Error while user trying to become a member", err);
    throw err;
  }
}

async function postBecomeAdmin(membership_status, id) {
  try {
    const query = await pool.query(
      // "UPDATE users SET membership_status = $1 WHERE id IN (SELECT user_id FROM messages WHERE $2 = user_id)",
      "UPDATE users SET membership_status = $1 WHERE id = $2",
      [membership_status, id]
    );

    return query.rows[0];
  } catch (err) {
    console.error("Error while user trying to become a admin", err);
    throw err;
  }
}

module.exports = {
  getUser,
  postCreateUser,
  postBecomeMember,
  postBecomeAdmin,
};
