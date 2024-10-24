const keyboardTemplate = {
  reply_markup: {
    keyboard: [
      [{ text: "Kudos" }, { text: "Profile" }],
      [{ text: "Applaud" }, { text: "List" }],
    ],
    resize_keyboard: true,
    remove_keyboard: true,
  },
};

const mainMenuTemplate = {
  reply_markup: {
    keyboard: [
      [{ text: "Explore" }, { text: "Profile" }],
      [{ text: "Quest" }, { text: "Equipment" }],
    ],
    resize_keyboard: true,
    remove_keyboard: true,
  },
};

module.exports = { keyboardTemplate, mainMenuTemplate };
