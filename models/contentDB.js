const { default: mongoose } = require("mongoose");
mongoose.pluralize(null);
const { connectContentDBs } = require("../databases/contentDB");

const tutorialSchema = mongoose.Schema({
  title: String,
  link: String,
  source: String,
  type_of_source: String,
});

const sport_workshopSchema = mongoose.Schema({
  time_slot_start: Number,
  time_slot_end: Number,
  content: String,
  coach_user_id: mongoose.ObjectId,
  max_strength: Number,
  court_id: mongoose.ObjectId,
  date_slot: String,
  participants_id: [mongoose.ObjectId],
  type_of_sport: String,
});

const yoga_sessionSchema = mongoose.Schema({
  max_strength: Number,
  content: String,
  date_slot: String,
  participants_id: [mongoose.ObjectId],
  yoga_instructor_user_id: mongoose.ObjectId,
  time_slot_start: Number,
  time_slot_end: Number,
  location: String,
});

const blog_counsellorSchema = mongoose.Schema({
  content: String,
  title: String,
  counsellor_username: String,
});
const cousellor_availabilitySchema = mongoose.Schema({
  day_vector: [Number],
  hour_vector: [Number],
  counsellor_user_id: mongoose.ObjectId,
  date_slot: String,
  date_slot_time_vector: [Number],
});

const { contentDB } = connectContentDBs();
module.exports = {
  tutorialSchema: contentDB.model("tutorials", tutorialSchema),
  sport_workshopSchema: contentDB.model(
    "sport_workshops",
    sport_workshopSchema
  ),
  yoga_sessionSchema: contentDB.model("yoga_sessions", yoga_sessionSchema),
  blog_counsellorSchema: contentDB.model(
    "blogs_posted_by_counsellors",
    blog_counsellorSchema
  ),
  counsellor_availabilitySchema: contentDB.model(
    "time_slots_by_counsellors",
    cousellor_availabilitySchema
  ),
};
