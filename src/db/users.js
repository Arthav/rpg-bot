const { logToFile } = require("../logger");

module.exports = (pool) => {
  // Function to check if user exists
  async function userExists(telegramId) {
    logToFile(`id user: ${telegramId}`);
    const res = await pool.query(
      "SELECT * FROM players WHERE telegram_id = $1",
      [telegramId]
    );
    return res.rows.length > 0;
  }

  // Function to create a new player
  async function createUser(telegramId, username, race, className) {
    await pool.query(
      `INSERT INTO players 
    (telegram_id, username, race, class) 
    VALUES ($1, $2, $3, $4)`,
      [telegramId, username, 'human', 'knight']
    );
  }

  // Function to get all users
  async function getAllUsers() {
    const res = await pool.query("SELECT username FROM players");
    return res.rows.map((user) => user.username);
  }

  
// Database function to choose class
async function chooseClass(telegramId, chosenClass) {
  await pool.query(
    'UPDATE players SET class = $1 WHERE telegram_id = $2',
    [chosenClass, telegramId]
  );
}

  return {
    userExists,
    createUser,
    getAllUsers,
    chooseClass,
  };
};
