const pool = require("./pool");

async function getMessagesWithUsers() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM messages JOIN users ON (messages.user_id = users.id)"
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
