// src/logger.js
const fs = require("fs");
const path = require("path");

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0]; // Get the date part of the ISO string
}

// Log function to write to file
function logToFile(message) {
  const currentDate = getCurrentDate();
  const logFilePath = path.join('log', `${currentDate}.log`); // Path for daily log file

  // Ensure the log directory exists
  fs.mkdirSync('log', { recursive: true });

  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`, { encoding: 'utf8' });
}

module.exports = {
  logToFile,
};
