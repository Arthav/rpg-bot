// src/bot.js
const TelegramBot = require("node-telegram-bot-api");
const config = require("./src/config");
const { pool } = require("./src/db/pool");
const { logToFile } = require("./src/logger");
// const { setupHandlers } = require("./src/handlers");
const startHandler = require("./src/handlers/startHandler");
const messageHandler = require("./src/handlers/messageHandler");
const profileHandler = require("./src/handlers/profileHandler");

// Create the bot with polling
const bot = new TelegramBot(config.botToken, { polling: true });

logToFile('Bot is running... Please don`t chase it...');
console.log('Bot is running... Please don`t chase it...');


// Setup all handlers
startHandler(bot);
messageHandler(bot);
profileHandler(bot);

// Log polling errors
bot.on("polling_error", (error) => {
  logToFile('Polling error: ' + error.message);
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const username = query.from.username || "Guest";
  logToFile(`Button pressed: ${query.data} by ${username}`);
  bot.answerCallbackQuery(query.id);
});

// Set up command handlers
// setupHandlers(bot);
