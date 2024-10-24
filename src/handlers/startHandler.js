const { logToFile } = require("../logger");
const { userExists, createUser, chooseClass, getUserProfile } = require("../db");
const { mainMenuTemplate } = require("../layout/keyboardLayout");

// Define process states
const processStates = {
  REGISTRATION: 'registration',
  CLASS_SELECTION: 'class',
  RACE_SELECTION: 'race',
};

// This will store the process state for each user
const userStates = {};

function startHandler(bot) {
  bot.onText(/\/start/, async (msg) => {
    logToFile(`Received command: ${msg.text}`);
    const chatId = msg.chat.id;
    
    // Check if user is already registered
    if (await userExists(chatId)) {
      const profile = await getUserProfile(chatId);
      // Create reply keyboard
      const keyboard = mainMenuTemplate;
      bot.sendMessage(chatId, "Link established");
      bot.sendMessage(chatId, "Welcome back " + profile.username + " the " + profile.class, keyboard);

      return;
    }

    bot.sendMessage(
      chatId,
      "Welcome! Please use the /register <username> command to create an account."
    );
  });

  bot.onText(/\/register (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match[1].trim(); // Get the username from the command

    // Check if user is already registered
    if (await userExists(chatId)) {
      bot.sendMessage(
        chatId,
        "You are already registered. Please use another command."
      );
      return;
    }

    try {
      await createUser(chatId, username);
      bot.sendMessage(
        chatId,
        `Account created successfully! Welcome, ${username}!`
      );

      // Set the user's process state to CLASS_SELECTION
      userStates[chatId] = processStates.CLASS_SELECTION;

      // Ask user to choose a class
      const classOptions = `
        Please choose your class:
        - /archer
        - /knight
        - /mage
        - /acolyte
      `;
      bot.sendMessage(chatId, classOptions);
    } catch (err) {
      logToFile("Database insertion error: " + err.message);
      bot.sendMessage(
        chatId,
        "Error creating your account. Please try again later."
      );
    }
  });

  // Function to choose a class
  const chooseClassFunc = async (chatId, selectedClass) => {
    try {
      await chooseClass(chatId, selectedClass);
      bot.sendMessage(chatId, `You have chosen the ${selectedClass} class!`);
    } catch (err) {
      logToFile("Database insertion error: " + err.message);
      bot.sendMessage(
        chatId,
        "Error choosing class. Please try again later."
      );
    }
  };

  // Class selection handlers
  bot.onText(/\/knight/, async (msg) => {
    const chatId = msg.chat.id;
    // Check if the user is in the correct process state
    if (userStates[chatId] !== processStates.CLASS_SELECTION) {
      return bot.sendMessage(chatId, "Please complete the registration process first.");
    }
    await chooseClassFunc(chatId, 'knight');

    // Set to next state if needed
    userStates[chatId] = processStates.RACE_SELECTION;
  });

  bot.onText(/\/archer/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== processStates.CLASS_SELECTION) {
      return bot.sendMessage(chatId, "Please complete the registration process first.");
    }
    await chooseClassFunc(chatId, 'archer');
    userStates[chatId] = processStates.RACE_SELECTION;
  });

  bot.onText(/\/mage/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== processStates.CLASS_SELECTION) {
      return bot.sendMessage(chatId, "Please complete the registration process first.");
    }
    await chooseClassFunc(chatId, 'mage');
    userStates[chatId] = processStates.RACE_SELECTION;
  });

  bot.onText(/\/acolyte/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== processStates.CLASS_SELECTION) {
      return bot.sendMessage(chatId, "Please complete the registration process first.");
    }
    await chooseClassFunc(chatId, 'acolyte');
    userStates[chatId] = processStates.RACE_SELECTION;
  });
}

module.exports = startHandler;

