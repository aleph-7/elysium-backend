const { default: mongoose } = require("mongoose");
mongoose.pluralize(null);
const { connectUserDB } = require("../databases/userDB");

const userSchema = mongoose.Schema({
  username: String,
  email_id: String,
  user_category: Number,
  password: String,
  profile_pic: String,
  type_of_sport: String,
});

const recordSchema = mongoose.Schema({
  user_id: mongoose.ObjectId,
  acceptances: Number,
  rejections: Number,
});

const { userDB } = connectUserDB();
module.exports = {
  userSchema: userDB.model("users", userSchema),
  recordSchema: userDB.model("records", recordSchema),
};
