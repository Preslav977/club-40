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

module.exports = {
  postMessageCreate,
};
