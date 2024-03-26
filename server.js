const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
require("dotenv").config();
const jsw = require("jsonwebtoken");
const secretKey =
  "a3e31fd2b7ed999b65ee2653024297b9f737e282afb9b686d8401e10c617a591";
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(parser.json());

const User = require("./models/userDB").userSchema;
const SportsBookings = require("./models/bookingsDB").sportBookingsSchema;
const Yoga_Sessions = require("./models/contentDB").yoga_sessionSchema;
const Workshop = require("./models/contentDB").sport_workshopSchema;
// which leaderboard is being imported, why are there different leaderboards for games
const Leaderboard = require("./models/leaderboardDB").leaderboardSchema;
const Blog = require("./models/contentDB").blog_counsellorSchema;
// which court is being imported, why are there different leaderboards for games
const Court = require("./models/courtDB").courtsSchema;
const Availability = require("./models/contentDB").counsellor_availabilitySchema;
const Gymbook = require("./models/bookingsDB").swimGymMembershipsSchema;
const Counsellor_Appointments = require("./models/bookingsDB").counsellorAppointmentsSchema;
const Blogs_Posted_By_Counsellors = require("./models/contentDB").blog_counsellorSchema;

app.get("/badminton/leaderboard", async (req, res) => {
  let attributeList;
  await Leaderboard.find({}).then((results) => {
    attributeList = results.map((doc) => [doc.position]);
  });
  res.json({ message: attributeList });
});

//Authentication
const authRoutes = require("./routes/auth");
app.use("", authRoutes);
//TUTORIALS
const tutorialsRoutes = require("./routes/tutorials");
app.use("/tutorials", tutorialsRoutes);
//WORKSHOPS
const workshopRoutes = require("./routes/workshop");
app.use("/workshops", workshopRoutes);
const applyWorkshopRoutes = require("./routes/apply_workshop");
app.use("/apply_workshop", applyWorkshopRoutes);
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);
//Animesh dump imported..
const bookingRoutes = require("./routes/algorithms/booking");
app.use("/booking", bookingRoutes);
//Counsellor Dashboard backend
const CounsellorRoutes = require("./routes/counsellor");
app.use("/counsellor", CounsellorRoutes);
//coach backend
const CoachRoutes = require("./routes/coach");
app.use("/coach", CoachRoutes);
const leaderboardRoutes = require("./routes/leaderboard");
app.use("/leaderboard", leaderboardRoutes);
const gymSwimmingRoutes = require("./routes/gyminstuctor");
app.use("",gymSwimmingRoutes);
//Listening to the server.
app.listen(process.env.PORT || 6300, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
const adminRoutes = require("./routes/admin");
app.use("", adminRoutes);

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const router = express.Router();
const checkAuth = require("./middleware/check_auth");

// A protected route
app.get("/profile", checkAuth, (req, res) => {
  // Access user data through req.userData
  req.username = "kushu";
  req.password = "yoyo";
  res.json({ message: "You are authenticated" });
});

// app.get("/profile", async (req, res) => {
//   // Access user data through req.userData
//   console.log("yoyo");
//   res.json({ message: "You are authenticated" });
// });

//// ARUSHU ///////

app.post("/yoga/postSession", async (req, res) => {
  try {
    //Creating a new user
    const new_yoga_session = new Yoga_Sessions({
      max_strength: req.body.batch_size,
      content: req.body.content,
      date_slot: req.body.startDate,
      participant_id: [],
      // yoga_instructor_user_id: req.body.yoga_instructor_user_id,
      time_slot_start: req.body.startTime,
      time_slot_end: req.body.endTime,
    });
    //Saving the user to the database
    console.log(req.body);
    const doc = await new_yoga_session.save();
    //Sending the response to the frontend
    res.status(200).json({ message: "Post successful" });
  } catch (err) {
    //Sending the error message to the frontend
    console.log(err);
    res.status(500).json({ error: "Post failed" });
  }
});

//Apply functionality

app.get("/self_help", async (req, res) => {
  let attributeList;
  await Blogs_Posted_By_Counsellors.find({}).then((results) => {
    attributeList = results;
    // .map((doc) => [doc.title]);
  });
  let len = attributeList.length;
  let randomIndex = Math.floor(Math.random() * len);
  res.json({ message: attributeList[randomIndex] });
});

const cron = require("node-cron");
const request = require("request");
const { date } = require("joi");

// Define the URL of your endpoint
const endpointUrl = "http://localhost:6300/booking/sport_booking";

// Define the cron schedule (runs every day at 12:01 AM)
cron.schedule(
  "01 0 * * *",
  () => {
    // Make an HTTP GET request to your endpoint
    request.get(endpointUrl, (error, response, body) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Request sent successfully.");
      }
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: req.user });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  jsw.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    console.log(decoded);
    next();
  });
}

app.get("/checkUser/:username", async (req, res) => {
  // console.log(req.body);
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }); // Assuming username is the field in your database that stores usernames

    if (user) {
      // User exists
      res.json({ exists: true });
    } else {
      // User doesn't exist
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/checkappliedTimeslots", async (req, res) => {
  try {
    const { user_id, selectedTime } = req.body;

    // Convert selectedTime to hours
    const selectedHour = parseInt(selectedTime.split(":")[0], 10);

    // Check if there is any existing booking for the user for the selected timeslot
    const existingBooking = await SportsBookings.findOne({
      user_id: user_id, // Assuming user_id is stored as ObjectId in the database
      time_slot: selectedHour, // Assuming time_slot is stored as an integer representing the hour in the database
    });

    if (existingBooking) {
      // If there is an existing booking, send a response indicating that the user has already applied for the timeslot
      res.json({ alreadyapplied: true });
    } else {
      // If there is no existing booking, send a response indicating that the user has not applied for the timeslot
      res.json({ alreadyapplied: false });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/badminton/active_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    if (type_book == "active") book = 0;
    const hour = parseInt(name.split(":")[0], 10);
    var date = new Date();
    const current_date =
 (date.getDate() < 10 ? "0" : "") +
      date.getDate() +
      "-" +
      (date.getMonth() < 9 ? "0" : "") +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear(); 
    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: current_date,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 1,
    });
    const bookings = await SportsBookings.find({
      date_slot: current_date,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
    });
    let length = bookings.length;

    if (req.body.sport_type == "badminton" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "squash" && length >= 4) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "table_tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////Pre-booking

app.post("/badminton/pre_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    const hour = parseInt(name.split(":")[0], 10);
    // var date = new Date();

    // Get the current date
    let currentDate = new Date();

    // Get the next date
    let nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1); // Adding 1 day

    // Format the next date as DD-MM-YYYY
    let day = nextDate.getDate();
    let month = nextDate.getMonth() + 1; // Month is zero-based, so add 1
    let year = nextDate.getFullYear();

    // Pad the day and month with leading zeros if needed
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    let nextDateFormatted = day + "-" + month + "-" + year;

    // console.log("Next Date:", nextDateFormatted);

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: nextDateFormatted,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 0,
    });
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/squash/active_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    if (type_book == "active") book = 0;
    const hour = parseInt(name.split(":")[0], 10);
    var date = new Date();
    const current_date =
      (date.getDate() < 10 ? "0" : "") +
      date.getDate() +
      "-" +
      (date.getMonth() < 9 ? "0" : "") +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear(); // Format the month as two digits

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: current_date,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 1,
    });
    const bookings = await SportsBookings.find({
      date_slot: current_date,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
    });
    let length = bookings.length;

    if (req.body.sport_type == "badminton" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "squash" && length >= 4) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "table_tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////Pre-booking

app.post("/squash/pre_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    const hour = parseInt(name.split(":")[0], 10);
    // Get the current date
    let currentDate = new Date();

    // Get the next date
    let nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1); // Adding 1 day

    // Format the next date as DD-MM-YYYY
    let day = nextDate.getDate();
    let month = nextDate.getMonth() + 1; // Month is zero-based, so add 1
    let year = nextDate.getFullYear();

    // Pad the day and month with leading zeros if needed
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    let nextDateFormatted = day + "-" + month + "-" + year;

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: nextDateFormatted,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 0,
    });
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/tennis/active_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    if (type_book == "active") book = 0;
    const hour = parseInt(name.split(":")[0], 10);
    var date = new Date();
    const current_date =
      (date.getDate() < 10 ? "0" : "") +
      date.getDate() +
      "-" +
      (date.getMonth() < 9 ? "0" : "") +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear(); // Format the month as two digits

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: current_date,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 1,
    });
    const bookings = await SportsBookings.find({
      date_slot: current_date,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
    });
    let length = bookings.length;

    if (req.body.sport_type == "badminton" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "squash" && length >= 4) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "table_tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////Pre-booking

app.post("/tennis/pre_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    const hour = parseInt(name.split(":")[0], 10);
    // Get the current date
    let currentDate = new Date();

    // Get the next date
    let nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1); // Adding 1 day

    // Format the next date as DD-MM-YYYY
    let day = nextDate.getDate();
    let month = nextDate.getMonth() + 1; // Month is zero-based, so add 1
    let year = nextDate.getFullYear();

    // Pad the day and month with leading zeros if needed
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    let nextDateFormatted = day + "-" + month + "-" + year;

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: nextDateFormatted,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 0,
    });
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/table_tennis/active_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    if (type_book == "active") book = 0;
    const hour = parseInt(name.split(":")[0], 10);
    var date = new Date();
    const current_date =
      (date.getDate() < 10 ? "0" : "") +
      date.getDate() +
      "-" +
      (date.getMonth() < 9 ? "0" : "") +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear(); // Format the month as two digits

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: current_date,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 1,
    });
    const bookings = await SportsBookings.find({
      date_slot: current_date,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
    });
    let length = bookings.length;

    if (req.body.sport_type == "badminton" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "squash" && length >= 4) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    if (req.body.sport_type == "table_tennis" && length >= 6) {
      return res.status(400).json({ error: "Court is full" });
    }
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////Pre-booking

app.post("/table_tennis/pre_booking", async (req, res) => {
  console.log(req.body);

  //Searching for players mongoDB Ids
  const mongodbIds = [];
  try {
    const players = await User.find(
      { username: { $in: req.body.players } },
      "_id username"
    );
    players.forEach((player) => {
      mongodbIds.push(player._id.toString());
    });
    // Log MongoDB IDs
    console.log("MongoDB IDs:", mongodbIds);
    console.log(mongodbIds.length);

    const name = req.body.slot;
    const type_book = req.body.type;
    let book = 1;
    const hour = parseInt(name.split(":")[0], 10);
    // Get the current date
    let currentDate = new Date();

    // Get the next date
    let nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1); // Adding 1 day

    // Format the next date as DD-MM-YYYY
    let day = nextDate.getDate();
    let month = nextDate.getMonth() + 1; // Month is zero-based, so add 1
    let year = nextDate.getFullYear();

    // Pad the day and month with leading zeros if needed
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    let nextDateFormatted = day + "-" + month + "-" + year;

    const booking = new SportsBookings({
      user_id: req.body.user_id,
      time_slot: hour,
      type_of_sport: req.body.sport_type,
      time_of_booking: new Date(),
      date_slot: nextDateFormatted,
      type_of_booking: book,
      show_up_status: 0,
      court_id: null,
      partners_id: mongodbIds,
      no_partners: mongodbIds.length,
      booking_status: 0,
    });
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

