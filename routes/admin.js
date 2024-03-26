const express = require("express");
const router = express.Router();
const User = require("../models/userDB").userSchema;
const SportsBookings = require("../models/bookingsDB").sportBookingsSchema;
const BadmintonCourt = require("../models/courtDB").badmintonCourtsSchema;
const SquashCourt = require("../models/courtDB").squashCourtsSchema;
const TableTennisCourt = require("../models/courtDB").tabletennisCourtsSchema;
const TennisCourt = require("../models/courtDB").tennisCourtsSchema;
const BadmintonLeaderboard =
  require("../models/leaderboardDB").badmintonLeaderboardSchema;
const SquashLeaderboard =
  require("../models/leaderboardDB").squashLeaderboardSchema;
const TennisLeaderboard =
  require("../models/leaderboardDB").tennisLeaderboardSchema;
const TableTennisLeaderboard =
  require("../models/leaderboardDB").tabletennisLeaderboardSchema;

//LEADER BOARD IMPLEMENTATION
router.get("/badminton/attendance", async (req, res) => {
  let attributeList;
  await BadmintonCourt.find({}).then((results) => {
    attributeList = results.map((doc) => [
      doc.court_name,
      doc.occupancy_status,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/squash/attendance", async (req, res) => {
  let attributeList;
  await SquashCourt.find({}).then((results) => {
    attributeList = results.map((doc) => [
      doc.court_name,
      doc.occupancy_status,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/table_tennis/attendance", async (req, res) => {
  let attributeList;
  await TableTennisCourt.find({}).then((results) => {
    attributeList = results.map((doc) => [
      doc.court_name,
      doc.occupancy_status,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/tennis/attendance", async (req, res) => {
  let attributeList;
  await TennisCourt.find({}).then((results) => {
    attributeList = results.map((doc) => [
      doc.court_name,
      doc.occupancy_status,
    ]);
  });
  res.json({ message: attributeList });
});

router.post("/court_name_entry", async (req, res) => {
  const { court_name, type_of_sport } = req.body;
  console.log(court_name);
  console.log(type_of_sport);
  let doc;

  if (type_of_sport === "badminton") {
    doc = await BadmintonCourt.findOne({ court_name: court_name });
  } else if (type_of_sport === "squash") {
    doc = await SquashCourt.findOne({ court_name: court_name });
  } else if (type_of_sport === "table_tennis") {
    doc = await TableTennisCourt.findOne({ court_name: court_name });
  } else if (type_of_sport === "tennis") {
    doc = await TennisCourt.findOne({ court_name: court_name });
  } else {
    return res.status(400).send("Invalid type_of_sport");
  }
  if (doc) {
    return res.status(200).send("Court exists for the specified sport");
  } else {
    return res.status(404).send("Court does not exist for the specified sport");
  }
});

router.post("/fill_entries", async (req, res) => {
  const { court_name, type_of_sport } = req.body;
  console.log(court_name);
  console.log(type_of_sport);
  let doc;
  if (type_of_sport === "badminton") {
    doc = await BadmintonCourt.findOne({ court_name: court_name });
  } else if (type_of_sport === "squash") {
    doc = await SquashCourt.findOne({ court_name: court_name });
  } else if (type_of_sport === "table_tennis") {
    doc = await TableTennisCourt.findOne({ court_name: court_name });
  } else if (type_of_sport === "tennis") {
    doc = await TennisCourt.findOne({ court_name: court_name });
  }
  court_id = doc._id;
  const currentTime = new Date().getHours();
  const currentDate = new Date().toISOString().slice(0, 10);
  const currentDay = currentDate.slice(8, 10);
  const currentMonth = currentDate.slice(5, 7);
  const currentYear = currentDate.slice(0, 4);
  const TodayDate = currentDay + "-" + currentMonth + "-" + currentYear;
  let booking_doc;
  try {
    booking_doc = await SportsBookings.find({
      court_id: court_id,
      time_slot: currentTime,
      date_slot: TodayDate,
    });
    if (booking_doc.length == 0) {
      res.status(400).json({ user_1: "", user_2: "", user_3: "", user_4: "" });
    } else {
      user_id_1 = booking_doc[0].user_id;
      user_id_2 = booking_doc[0].partners_id[0];
      user_id_3 = booking_doc[0].partners_id[1];
      user_id_4 = booking_doc[0].partners_id[2];
      if (user_id_1 != "000000000000000000000000")
        username_1 = (await User.findOne({ _id: user_id_1 })).username;
      else username_1 = "";
      if (user_id_2 != "000000000000000000000000")
        username_2 = (await User.findOne({ _id: user_id_2 })).username;
      else username_2 = "";
      if (user_id_3 != "000000000000000000000000")
        username_3 = (await User.findOne({ _id: user_id_3 })).username;
      else username_3 = "";
      if (user_id_4 != "000000000000000000000000")
        username_4 = (await User.findOne({ _id: user_id_4 })).username;
      else username_4 = "";
      res.json({
        user_1: username_1,
        user_2: username_2,
        user_3: username_3,
        user_4: username_4,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// ======================================
// UPDATE LEADERBOARD
// ======================================
router.post("/match_metric_marking", async (req, res) => {
  let user_1,
    user_2,
    user_3,
    user_4,
    attendance_1,
    attendance_2,
    attendance_3,
    attendance_4,
    position_1,
    position_2,
    position_3,
    position_4;
  user_1 = req.body.username_1;
  user_2 = req.body.username_2;
  user_3 = req.body.username_3;
  user_4 = req.body.username_4;
  attendance_1 = req.body.attendance_1;
  attendance_2 = req.body.attendance_2;
  attendance_3 = req.body.attendance_3;
  attendance_4 = req.body.attendance_4;
  position_1 = req.body.position_1;
  position_2 = req.body.position_2;
  position_3 = req.body.position_3;
  position_4 = req.body.position_4;
  type_of_sport = req.body.type_of_sport;
  let attributeList;
  if (type_of_sport === "badminton") {
    await BadmintonLeaderboard.find({}).then((results) => {
      attributeList = results.map((doc) => [
        doc._id,
        doc.user_id,
        doc.position,
      ]);
    });
  } else if (type_of_sport === "squash") {
    await SquashLeaderboard.find({}).then((results) => {
      attributeList = results.map((doc) => [
        doc._id,
        doc.user_id,
        doc.position,
      ]);
    });
  } else if (type_of_sport === "table_tennis") {
    await TableTennisLeaderboard.find({}).then((results) => {
      attributeList = results.map((doc) => [
        doc._id,
        doc.user_id,
        doc.position,
      ]);
    });
  } else if (type_of_sport === "tennis") {
    await TennisLeaderboard.find({}).then((results) => {
      attributeList = results.map((doc) => [
        doc._id,
        doc.user_id,
        doc.position,
      ]);
    });
  }
  let present_user_1, present_user_2;
  let present_user_position_1, present_user_position_2;

  if (attendance_1 === "present") {
    present_user_1 = user_1;
    present_user_position_1 = position_1;
  } else if (attendance_2 === "present") {
    present_user_1 = user_2;
    present_user_position_1 = position_2;
  } else if (attendance_3 === "present") {
    present_user_1 = user_3;
    present_user_position_1 = position_3;
  } else if (attendance_4 === "present") {
    present_user_1 = user_4;
    present_user_position_1 = position_4;
  }

  if (attendance_1 === "present" && user_1 !== present_user_1) {
    present_user_2 = user_1;
    present_user_position_2 = position_1;
  } else if (attendance_2 === "present" && user_2 !== present_user_1) {
    present_user_2 = user_2;
    present_user_position_2 = position_2;
  } else if (attendance_3 === "present" && user_3 !== present_user_1) {
    present_user_2 = user_3;
    present_user_position_2 = position_3;
  } else if (attendance_4 === "present" && user_4 !== present_user_1) {
    present_user_2 = user_4;
    present_user_position_2 = position_4;
  }
  console.log(present_user_1);
  console.log(present_user_2);
  let temp = await User.findOne({ username: present_user_1 });
  present_user_1_id = temp.id;
  temp = await User.findOne({ username: present_user_2 });
  present_user_2_id = temp.id;
  console.log(present_user_1_id);
  console.log(present_user_2_id);
  present_user_1_leaderboard_position = attributeList.find(
    (doc) => doc[1] == present_user_1_id
  )[2];
  present_user_2_leaderboard_position = attributeList.find(
    (doc) => doc[1] == present_user_2_id
  )[2];
  console.log(attributeList);
  attributeList.sort((a, b) => a[2] - b[2]);
  console.log(attributeList);
  if (
    (present_user_1_leaderboard_position <
      present_user_2_leaderboard_position &&
      present_user_position_1 > present_user_position_2) ||
    (present_user_1_leaderboard_position >
      present_user_2_leaderboard_position &&
      present_user_position_1 < present_user_position_2)
  ) {
    bad_player_position =
      present_user_1_leaderboard_position > present_user_2_leaderboard_position
        ? present_user_1_leaderboard_position
        : present_user_2_leaderboard_position;
    good_player_position =
      present_user_1_leaderboard_position < present_user_2_leaderboard_position
        ? present_user_1_leaderboard_position
        : present_user_2_leaderboard_position;

    for (i = good_player_position - 1; i < bad_player_position - 1; i++) {
      attributeList[i][2]++;
    }
    attributeList[bad_player_position - 1][2] = good_player_position;
  }

  //update databases
  for (let i = 0; i < attributeList.length; i++) {
    if (type_of_sport === "badminton") {
      BadmintonLeaderboard.findOneAndUpdate(
        { _id: attributeList[i][0] },
        { position: attributeList[i][2] },
        { new: true }
      )
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    } else if (type_of_sport === "squash") {
      SquashLeaderboard.findOneAndUpdate(
        { _id: attributeList[i][0] },
        { position: attributeList[i][2] },
        { new: true }
      )
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    } else if (type_of_sport === "table_tennis") {
      TableTennisLeaderboard.findOneAndUpdate(
        { _id: attributeList[i][0] },
        { position: attributeList[i][2] },
        { new: true }
      )
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    } else if (type_of_sport === "tennis") {
      TennisLeaderboard.findOneAndUpdate(
        { _id: attributeList[i][0] },
        { position: attributeList[i][2] },
        { new: true }
      )
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("Updated document:", updatedDocument);
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    }
  }
  console.log(attributeList);
  res.json({ message: attributeList });
});

// ======================================
// MARK ATTENDANCE
// ======================================

router.post("/mark_attendance", async (req, res) => {
  let user_1,
    user_2,
    user_3,
    user_4,
    attendance_1,
    attendance_2,
    attendance_3,
    attendance_4,
    position_1,
    position_2,
    position_3,
    position_4;
  user_1 = req.body.username_1;
  user_2 = req.body.username_2;
  user_3 = req.body.username_3;
  user_4 = req.body.username_4;
  attendance_1 = req.body.attendance_1;
  attendance_2 = req.body.attendance_2;
  attendance_3 = req.body.attendance_3;
  attendance_4 = req.body.attendance_4;
  position_1 = req.body.position_1;
  position_2 = req.body.position_2;
  position_3 = req.body.position_3;
  position_4 = req.body.position_4;
  type_of_sport = req.body.type_of_sport;
  const currentTime = new Date().getHours();
  const currentDate = new Date().toISOString().slice(0, 10);
  const currentDay = currentDate.slice(8, 10);
  const currentMonth = currentDate.slice(5, 7);
  const currentYear = currentDate.slice(0, 4);
  const TodayDate = currentDay + "-" + currentMonth + "-" + currentYear;
  let user_id_1;
  user_id_1 = (await User.findOne({ username: user_1 }))._id;
  console.log(user_id_1);
  let bookingDoc;
  bookingDoc = await SportsBookings.findOne({
    user_id: user_id_1,
    time_slot: currentTime,
    date_slot: TodayDate,
  });
  totalPlayers = bookingDoc.partners_id.length + 1;
  totalPresent =
    (attendance_1 === "present" ? 1 : 0) +
    (attendance_2 === "present" ? 1 : 0) +
    (attendance_3 === "present" ? 1 : 0) +
    (attendance_4 === "present" ? 1 : 0);
  if (totalPresent >= totalPlayers / 2) {
    console.log(bookingDoc);
    console.log("Attendance Marked");
    bookingDoc.show_up_status = 1;
  } else {
    bookingDoc.show_up_status = 0;
  }
  bookingDoc.save();
  res.json({ message: "Attendance Marked" });
});

module.exports = router;
