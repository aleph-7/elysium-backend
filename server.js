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
    const user = await User.findOne({ username:username,user_category:1 }); // Assuming username is the field in your database that stores usernames

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

app.post("/active_booking", async (req, res) => {
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
    const doc = await booking.save();
    res.json(doc);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//////Pre-booking
app.post("/pre_booking", async (req, res) => {
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


app.post("/getAvailableSlots", async (req, res) => {
  const { date, type_of_sport,capacity } = req.body;
  console.log(req.body);
  try {
    const bookings = await SportsBookings.find({ date_slot: date, type_of_sport: type_of_sport, booking_status: 1 });
    const bookedSlots = bookings.reduce((acc, booking) => {
      if (!acc[booking.time_slot]) {
        acc[booking.time_slot] = 1;
      } else {
        acc[booking.time_slot]++;
      }
      return acc;
    }, {});
    console.log(bookedSlots);
    // Generate all possible slots
    const allSlots = [
      "6", "7", "8","16", "17", 
      "18", "19", "20"
    ];

    // Determine available slots
    const availableSlots = allSlots.filter(slot => {
      return !bookedSlots.hasOwnProperty(slot) || bookedSlots[slot] < capacity;
    });

    res.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots for date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



///////////Gym and Pool membership pass
app.get('/gym/swim_pass', async (req, res) => {
  try {
    const { userid, year, month,type } = req.query;
    console.log(req.query);
    // Fetch membership details from the database based on the provided parameters
    const membershipDetails = await Gymbook.find({
      user_id: userid,
      year: year,
      month: month,
      type:type,
      booking_status:1,
    });


    const formattedTimeSlots = membershipDetails.map(detail => {
      const startTime = `${detail.time_slot}:00 `; // Assuming slots are in AM
      const endTime = `${detail.time_slot + 1}:00`; // Assuming each slot is 1 hour
      return `${startTime}-${endTime}`;
    });

    // Send the formatted time slots back to the client
    res.json(formattedTimeSlots);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching membership details." });
  }
});



///////////////////Gym and Pool Booking
app.post("/gym/swim_booking", async (req, res) => {
  console.log(req.body);
  try {
    const month = req.body.month;
    const time_slot = parseInt(req.body.time_slot.split(":")[0], 10);
    const user_id = req.body.user_id;
    const year = req.body.year;
    const time = req.body.time;
    const type = req.body.type;
    // Check if the user has already booked the same slot
    const existingBooking = await Gymbook.findOne({
      month: month,
      time_slot: time_slot,
      user_id: user_id,
      year: year,
      type:type,
    });

    if (existingBooking) {
      // User has already booked the slot
      console.log("booked");
      return res.status(400).json({ error: "You have already booked this slot." });
    }

    // Check if the maximum capacity for the slot has been reached
    const countBookings = await Gymbook.countDocuments({
      month: month,
      time_slot: time_slot,
      year: year,
      booking_status:1,
      type: type,
    });

    if (countBookings >= 40) {
      // Maximum capacity reached, save a document with booking_status -1
      const unsuccessfulBooking = new Gymbook({
        month: month,
        time_slot: time_slot,
        user_id: user_id,
        type: type,
        year: year,
        booking_status: -1, // Set booking status to -1 for unsuccessful booking
        time_of_booking: time,
      });

      await unsuccessfulBooking.save();
      return res.status(400).json({ error: "Maximum capacity for this slot has been reached." });
    }

    // If all checks pass, proceed with booking
    const booking = new Gymbook({
      month: month,
      time_slot: time_slot,
      user_id: user_id,
      type: type,
      year: year,
      booking_status: 1, // Set booking status to 1 for successful booking
      time_of_booking: time,
    });

    const doc = await booking.save();
    res.json(doc);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});