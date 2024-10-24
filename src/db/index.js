const pool = require("./pool"); // Import the pool

// Import the functions from each module, passing in the pool
const users = require("./users")(pool);
const profile = require("./profile")(pool);

module.exports = {
  ...users,    // User-related functions (userExists, createUser, etc.)
  ...profile,  // Profile-related functions (getUserProfile, etc.)
};
