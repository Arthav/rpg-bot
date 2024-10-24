// src/handlers/profileHandler.js

const { logToFile } = require("../logger");
const { getUserProfile } = require("../db");

function profileHandler(bot) {
  bot.onText(/\/profile/, async (msg) => {
    logToFile(`Received command: ${msg.text}`);
    const chatId = msg.chat.id;

    try {
      const profile = await getUserProfile(chatId);

      logToFile(`Profile: ${profile}`);
      if (!profile) {
        bot.sendMessage(
          chatId,
          "Profile not found. Please register first using /register."
        );
        return;
      }

      // Create a profile message
      const profileMessage = `
          *Profile Information*
          Username: ${profile.username || "N/A"}
          Race: ${profile.race || "N/A"}
          Class: ${profile.class || "N/A"}
          Level: ${profile.level}
          Experience: ${profile.experience}
          Health: ${profile.health} / ${profile.max_health}
          Mana: ${profile.mana} / ${profile.max_mana}
      `;

      bot.sendMessage(chatId, profileMessage, { parse_mode: "Markdown" });
    } catch (err) {
      logToFile("Error fetching profile: " + err.message);
      bot.sendMessage(
        chatId,
        "An error occurred while fetching your profile. Please try again later."
      );
    }
  });
}

module.exports = profileHandler;
