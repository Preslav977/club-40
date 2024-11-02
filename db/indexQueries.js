const pool = require("./pool");

async function getMessagesWithUsers() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users JOIN messages ON users.id = messages.user_id"
    );

    return rows;
  } catch (err) {
    console.error("Error while trying to get all messages", err);
    throw err;
  }
}

module.exports = {
  getMessagesWithUsers,
};
