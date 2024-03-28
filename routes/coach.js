const express = require("express");
const router = express.Router();

const Workshop = require("./../models/contentDB").sport_workshopSchema;
const SportsBookings = require("./../models/bookingsDB").sportBookingsSchema;
const User = require("../models/userDB").userSchema;

router.post("/postWorkshop", async (req, res) => {
  try {
    const new_workshop = new Workshop({
      time_slot_start: req.body.start_time,
      time_slot_end: req.body.end_time,
      content: req.body.description,
      // equipment: req.body.equipment,
      equipment: {
        raquet: Number(req.body.raquet),
        cork: Number(req.body.cork),
        shoe: Number(req.body.shoe),
      },
      coach_user_id: req.body.coach_user_id,
      max_strength: req.body.max_participants,
      date_slot: req.body.date,
      participant_id: [],
      type_of_sport: req.body.type_of_sport,
    });
    console.log(new_workshop);
    const doc = await new_workshop.save();
    //Sending the response to the frontend
    res.status(200).json({ message: "Post successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Post failed" });
  }
});

router.get("/getWorkshops", async (req, res) => {
  try {
    let attributeList;
    const sport = req.query.type_of_sport;
    // Assuming the coach_user_id is passed as a query parameter
    // Retrieve workshops associated with the specified coach_user_id
    await Workshop.find({ type_of_sport: sport }).then((results) => {
      attributeList = results.map((doc) => [
        doc.content,
        doc.participants_id.length, // Get the length of participants_id array
        doc.max_strength,
        doc.participants_id,
      ]);
    });

    for (let i = 0; i < attributeList.length; i++) {
      let finalParticipantsList = [];
      for (let j = 0; j < attributeList[i][3].length; j++) {
        let user_id = attributeList[i][3][j];
        try {
          let user_name = await User.findOne({ _id: user_id });
          if (!user_name) {
            finalParticipantsList.push("Anonymous");
          } else {
            finalParticipantsList.push(user_name.username);
          }
        } catch (err) {
          console.log(err);
        }
      }
      attributeList[i][3] = finalParticipantsList;
    }
    console.log(attributeList);
    // Sending the retrieved workshops as a response to the frontend
    res.status(200).json({ message: attributeList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve workshops" });
  }
});

router.get("/statistics", async (req, res) => {
  let attributeList = [];
  let vacancies = [];
  let totalStrength = [];
  let participants = [];
  let labels = [];
  let finalAttributeList = [];
  const sport = req.query.type_of_sport;
  await Workshop.find({
    type_of_sport: sport,
  })
    .then((results) => {
      vacancies = results.map((doc) => doc.max_strength);
      totalStrength = results.map(
        (doc) => doc.participants_id.length + doc.max_strength
      );
      participants = results.map((doc) => doc.participants_id.length);
    })
    .catch((err) => {
      console.log(err);
    });
  for (let i = 0; i < vacancies.length; i++) {
    labels.push("Workshop " + (i + 1));
  }
  attributeList.push(labels, vacancies, totalStrength, participants, [
    { data: vacancies, label: "vacancies" },
    { data: participants, label: "participants" },
    { data: totalStrength, label: "totalStrength" },
  ]);
  console.log(attributeList);
  res.json({ message: attributeList });
});
// router.get("/statistics", async (req, res) => {
//   try {
//     let attributeList;
//     const sport = req.query.type_of_sport;
//     // Assuming the coach_user_id is passed as a query parameter
//     // Retrieve workshops associated with the specified coach_user_id
//     await Workshop.find({ type_of_sport: sport }).then((results) => {
//       attributeList = results.map((doc) => ({
//         content: doc.content,
//         participantsCount: doc.participants_id.length, // Get the length of participants_id array
//       }));
//     });

//     console.log(attributeList);

//     // Sending the retrieved workshops as a response to the frontend
//     res.status(200).json({ attributeList });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Failed to retrieve workshops" });
//   }
// });

router.post("/reserveCourt", async (req, res) => {
  try {
    const new_reservation = new SportsBookings({
      time_slot: req.body.time_slot,
      date: req.body.date_slot,
      court_id: req.body.court_id,
      show_up_status: req.body.show_up_status,
      type_of_sport: req.body.type_of_sport,
      time_of_booking: req.body.time_of_booking,
      booking_status: req.body.booking_status,
      user_id: req.body.user_id,
    });
    console.log(new_reservation);
    const doc = await new_reservation.save();
    //Sending the response to the frontend
    res.status(200).json({ message: "Reservation successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Reservation failed" });
  }
});

module.exports = router;
