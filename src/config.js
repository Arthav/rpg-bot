// src/config.js
require("dotenv").config({ path: require('find-config')('.env') });

module.exports = {
  botToken: process.env.BOT_TOKEN,
  databaseUrl: process.env.DATABASE_URL,
};
