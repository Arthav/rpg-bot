module.exports = (pool) => {
  // Function to get user profile
  async function getUserProfile(telegramId) {
    const res = await pool.query(
      `SELECT username, race, class, level, experience, health, max_health, mana, max_mana
       FROM players 
       WHERE telegram_id = $1`,
      [telegramId]
    );
    return res.rows[0]; // Return the user profile object
  }

  return {
    getUserProfile,
  };
};
