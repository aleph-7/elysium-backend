const mongoose = require("mongoose");
mongoose.pluralize(null);
require("dotenv").config();

const connectLeaderboardDBs = () => {
  try {
    const leaderboardDB = mongoose.createConnection(
      process.env.MONGODB_Leaderboard
    );
    console.log("Leaderboard DB Connected");
    return { leaderboardDB };
  } catch (error) {
    console.error("Error: $(error.message)");
    process.exit(1);
  }
};
module.exports = { connectLeaderboardDBs };
