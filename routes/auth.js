const express = require("express");
const User = require("../models/userDB").userSchema;
const Leaderboard_Badminton =
  require("../models/leaderboardDB").badmintonLeaderboardSchema;
const Leaderboard_Squash =
  require("../models/leaderboardDB").squashLeaderboardSchema;
const Leaderboard_Tennis =
  require("../models/leaderboardDB").tennisLeaderboardSchema;
const Leaderboard_TableTennis =
  require("../models/leaderboardDB").tabletennisLeaderboardSchema;
const router = express.Router();
const jsw = require("jsonwebtoken");
const secretKey =
  "a3e31fd2b7ed999b65ee2653024297b9f737e282afb9b686d8401e10c617a591";
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  try {
    // Check if the username or email ID already exists in the database
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email_id: req.body.email_id }],
    });

    // If user with the same username or email ID already exists, return an error
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email ID already exists" });
    }

    // Hashing the passwords before saving them to the database
    const hashed_password = await bcrypt.hash(req.body.password, 10);

    // Creating a new user
    const new_user = new User({
      username: req.body.username,
      email_id: req.body.email_id,
      user_category: 1,
      password: hashed_password,
      profile_pic: "",
      type_of_sport: "",
    });
    // Saving the user to the database
    const doc = await new_user.save();

    badminton_db_length = await Leaderboard_Badminton.find().countDocuments();
    const badminton_leaderboard = new Leaderboard_Badminton({
      user_id: doc._id,
      position: badminton_db_length + 1,
    });
    await badminton_leaderboard.save();

    squash_db_length = await Leaderboard_Squash.find().countDocuments();
    const squash_leaderboard = new Leaderboard_Squash({
      user_id: doc._id,
      position: squash_db_length + 1,
    });
    await squash_leaderboard.save();

    table_tennis_db_length =
      await Leaderboard_TableTennis.find().countDocuments();
    const table_tennis_leaderboard = new Leaderboard_TableTennis({
      user_id: doc._id,
      position: table_tennis_db_length + 1,
    });
    await table_tennis_leaderboard.save();

    tennis_db_length = await Leaderboard_Tennis.find().countDocuments();
    const tennis_leaderboard = new Leaderboard_Tennis({
      user_id: doc._id,
      position: tennis_db_length + 1,
    });
    // Sending the response to the frontend
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    // Sending the error message to the frontend
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  console.log("Login Pressed");
  console.log(req.body.username);
  try {
    user = await User.findOne({ username: req.body.username });
    if (user) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log("Koi Mil Gaya");
      if (passwordMatch) {
        console.log("Password Matched");
        const token = jsw.sign(
          {
            username: user.username,
            userMongoId: user._id,
            category: user.user_category,
            type_of_sport: user.type_of_sport,
          },
          secretKey,
          {
            expiresIn: "1 hour",
          }
        );
        console.log(token);
        console.log(user.type_of_sport);
        res.status(200).json({
          token,
          userMongoId: user._id,
          userId: user.username,
          email: user.email_id,
          category: user.user_category,
          profile_pic: user.profile_pic,
          type_of_sport: user.type_of_sport,
        });
      } else {
        console.log("Password Mismatch");
        return res.status(401).json({ error: "Authentication failed" });
      }
    } else {
      console.log("Koi Nahi Mila");
      return res.status(401).json({ error: "Authentication failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = router;
