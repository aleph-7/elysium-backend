const { default: mongoose } = require("mongoose");
mongoose.pluralize(null);
const { connectLeaderboardDBs } = require("../databases/leaderboardDB");

const leaderboardSchema = mongoose.Schema({
  user_id: mongoose.ObjectId,
  position: Number,
});

const { leaderboardDB } = connectLeaderboardDBs();
module.exports = {
  badmintonLeaderboardSchema: leaderboardDB.model(
    "badmintons",
    leaderboardSchema
  ),
  squashLeaderboardSchema: leaderboardDB.model("squashes", leaderboardSchema),
  tabletennisLeaderboardSchema: leaderboardDB.model(
    "table_tennis",
    leaderboardSchema
  ),
  tennisLeaderboardSchema: leaderboardDB.model("tennis", leaderboardSchema),
};
