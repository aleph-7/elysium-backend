const { default: mongoose } = require("mongoose");
mongoose.pluralize(null);
const { connectCourtsDBs } = require("../databases/courtDB");

const courtsSchema = mongoose.Schema({
  _id: mongoose.ObjectId,
  occupancy_status: Number,
  court_name: String,
});

const { CourtDB } = connectCourtsDBs();
module.exports = {
  badmintonCourtsSchema: CourtDB.model("badminton", courtsSchema),
  squashCourtsSchema: CourtDB.model("squash", courtsSchema),
  tabletennisCourtsSchema: CourtDB.model("table_tennis", courtsSchema),
  tennisCourtsSchema: CourtDB.model("tennis", courtsSchema),
};
