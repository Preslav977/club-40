const pool = require("./pool");

async function postMessageCreate(title, content, user_id) {
  try {
    const query = await pool.query(
      "INSERT INTO messages (title, content, timestamp, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, new Date(), user_id]
    );

    return query.rows[0];
  } catch (err) {
    console.error("Error creating a message", err);
    throw err;
  }
}

async function postMessageDelete(id) {
  try {
    const { rows } = await pool.query(
      "SELECT user_id FROM messages WHERE user_id IN (SELECT id FROM users WHERE id = user_id)"
    );

    if (rows[0]) {
      const query = await pool.query(
        "DELETE FROM messages WHERE user_id IN (SELECT users.id FROM users WHERE user_id = $1 OR membership_status = 'admin')",
        [id]
      );

      return query.rows[0];
    } else {
      const query = await pool.query("DELETE FROM messages WHERE id = $1", [
        id,
      ]);

      return query.rows[0];
    }
  } catch (err) {
    console.error("Error deleting a message, user is not an admin", err);
    throw err;
  }
}

module.exports = {
  postMessageCreate,
  postMessageDelete,
};
