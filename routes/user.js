const express = require("express");
const router = express.Router();

const SportsBookings = require("../models/bookingsDB").sportBookingsSchema;
const Counsellor_availability = require("../models/contentDB").counsellor_availabilitySchema;
const Counsellor_Appointments = require("../models/bookingsDB").counsellorAppointmentsSchema;
const User=require("../models/userDB").userSchema;


//GET COUNSELLOR APPOINTMENTS
// doesnt seem to be called anywhere in front end currently
router.get("/counsellor_appointments", async (req, res) => {
  let attributeList;
  await Counsellor_Appointments.find({}).then((results) => {
    attributeList = results.map((doc) => [doc]);
  });
  res.json({ message: attributeList });
});


router.get("/get_booking_history", async (req, res) => {
  const { user_id } = req.body.user_id;

  let doc;
  doc = await SportsBookings.find({ user_id: user_id });
  await SportsBookings.find({ user_id: user_id }).then((results) => {
    attributeList = results.map((doc) => [
      doc.type_of_sport == "table_tennis" ? "table tennis" : doc.type_of_sport,
      doc.date_slot,
      doc.booking_status,
    ]);
  });
  res.status(200).json({ message: attributeList });
});

// =================================
// COUNSELLOR USER PAGES 1

router.get("/counsellor_page_user", async (req, res) => {
  let attributeList;
  await Counsellor_availability.find({}).then((results) => {
    attributeList = results.map((doc) => [
      doc.day_vector,
      doc.hour_vector,
      doc.counsellor_user_id,
      doc.date_slot,
      doc.date_slot_time_vector,
      doc.counsellor_username,
      doc.available_day_or_date,
      doc.available_time_slots_12hour,
    ]);
  });
  for (let i = 0; i < attributeList.length; i++) {
    let username;
    try {
      username = (await User.findOne({ _id: attributeList[i][2] })).username;
    } catch (err) {
      console.log(err);
    }
    attributeList[i][6] = username;
  }
  for (let i = 0; i < attributeList.length; i++) {
    let available_day_or_date = "";
    let available_time_slots_12hour = "";
    if (attributeList[i][3] !== "none") {
      available_day_or_date = attributeList[i][3];
      for (let j = 0; j < 24; j++) {
        if (attributeList[i][4][j] === 1)
          available_time_slots_12hour +=
            (j < 12 ? j : j % 12).toString() + (j < 12 ? "am" : "pm") + " ";
      }
    } else {
      available_day_or_date += attributeList[i][0][0] === 1 ? "M" : "";
      available_day_or_date += attributeList[i][0][1] === 1 ? "T" : "";
      available_day_or_date += attributeList[i][0][2] === 1 ? "W" : "";
      available_day_or_date += attributeList[i][0][3] === 1 ? "Th" : "";
      available_day_or_date += attributeList[i][0][4] === 1 ? "F" : "";
      available_day_or_date += attributeList[i][0][5] === 1 ? "Sa" : "";
      available_day_or_date += attributeList[i][0][6] === 1 ? "Su" : "";
      for (let j = 0; j < 24; j++) {
        if (attributeList[i][1][j] === 1)
          available_time_slots_12hour +=
            (j < 12 ? j : j % 12).toString() + (j < 12 ? "am" : "pm") + " ";
      }
    }
    attributeList[i][7] = available_day_or_date;
    attributeList[i][8] = available_time_slots_12hour;
  }

  let messageAttributeList = [];
  for (let i = 0; i < attributeList.length; i++) {
    let messageList = [];
    messageList.push(attributeList[i][6]);
    messageList.push(attributeList[i][7]);
    messageList.push(attributeList[i][8]);
    messageAttributeList.push(messageList);
  }

  res.json({ message: messageAttributeList });
});

// =====================================
// COUNSELLOR USER PAGES 2

router.get("/institute_counsellors", async (req, res) => {
  let attributeList;
  await User.find({ user_category: 2 }).then((results) => {
    attributeList = results.map((doc) => [doc.username, doc._id]);
  });
  res.json({ message: attributeList });
});

router.post("/get_available_days", async (req, res) => {
  counsellor_username = req.body.counsellor_username;
  console.log(counsellor_username);
  counsellor_user_id = (await User.findOne({ username: counsellor_username }))
    ._id;
  let attributeList;
  await Counsellor_availability
    .find({ counsellor_user_id: counsellor_user_id })
    .then((results) => {
      attributeList = results.map((doc) => [doc.day_vector, doc.date_slot]);
    })
    .then(() => console.log(attributeList));
  let messageAttributeList = [];
  for (let i = 0; i < attributeList.length; i++) {
    if (attributeList[i][1] !== "none")
      messageAttributeList.push(attributeList[i][1]);
    else {
      if (attributeList[i][0][0] === 1) messageAttributeList.push("Monday");
      if (attributeList[i][0][1] === 1) messageAttributeList.push("Tuesday");
      if (attributeList[i][0][2] === 1) messageAttributeList.push("Wednesday");
      if (attributeList[i][0][3] === 1) messageAttributeList.push("Thursday");
      if (attributeList[i][0][4] === 1) messageAttributeList.push("Friday");
      if (attributeList[i][0][5] === 1) messageAttributeList.push("Saturday");
      if (attributeList[i][0][6] === 1) messageAttributeList.push("Sunday");
    }
  }
  res.json({ message: messageAttributeList });
});

function getDate(date) {
  let current_date_get_date = new Date();
  let day_of_week = current_date_get_date.getDay();
  let days_until;
  if (date === "Monday") days_until = (8 - day_of_week) % 7;
  else if (date === "Tuesday") days_until = (9 - day_of_week) % 7;
  else if (date === "Wednesday") days_until = (10 - day_of_week) % 7;
  else if (date === "Thursday") days_until = (11 - day_of_week) % 7;
  else if (date === "Friday") days_until = (12 - day_of_week) % 7;
  else if (date === "Saturday") days_until = (13 - day_of_week) % 7;
  else if (date === "Sunday") days_until = (14 - day_of_week) % 7;
  let new_date = new Date(current_date_get_date);
  new_date.setDate(new_date.getDate() + days_until);
  let year = new_date.getFullYear();
  let month = (new_date.getMonth() + 1).toString().padStart(2, "0");
  let dayOfMonth = new_date.getDate().toString().padStart(2, "0");
  return dayOfMonth + "-" + month + "-" + year;
}

async function check_booking (counsellor_user_id, date, parameter, attributeList) {
  if(parameter)
  {
    if(date==0){
      date=getDate("Monday");
    }
    else if(date==1)
    {
      date=getDate("Tuesday");
    }
    else if(date==2)
    {
      date=getDate("Wednesday");
    }
    else if(date==3)
    {
      date=getDate("Thursday");
    }
    else if(date==4)
    {
      date=getDate("Friday");
    }
    else if(date==5)
    {
      date=getDate("Saturday");
    }
    else if(date==6)
    {
      date=getDate("Sunday");
    }
  }
  let attributeListFinal=[];
  for(let i=0; i<23;i++){
    if(attributeList[0][0][i]==1)
    {
      query={counsellor_user_id: counsellor_user_id, date_slot: date, time_slot: i, booking_status:1};
      let result=await Counsellor_Appointments.find(query);
      if(result.length>0)
      {
        ;
      }
      else
      {
        attributeListFinal.push(i);
      }
    }
  }
  return attributeListFinal;
}

router.post("/get_available_time_slots", async (req, res) => {
  counsellor_username = req.body.counsellor_username;
  let date = req.body.date;
  parameter = 0;
  if (date === "Monday") {
    date = 0;
    parameter = 1;
  } else if (date === "Tuesday") {
    date = 1;
    parameter = 1;
  } else if (date === "Wednesday") {
    date = 2;
    parameter = 1;
  } else if (date === "Thursday") {
    date = 3;
    parameter = 1;
  } else if (date === "Friday") {
    date = 4;
    parameter = 1;
  } else if (date === "Saturday") {
    date = 5;
    parameter = 1;
  } else if (date === "Sunday") {
    date = 6;
    parameter = 1;
  }
  counsellor_user_id = (await User.findOne({ username: counsellor_username }))
    ._id;
  let attributeList;
  if (parameter) {
    const query = { counsellor_user_id: counsellor_user_id };
    query[`day_vector.${date}`] = 1;
    await Counsellor_availability.find(query).then((results) => {
      attributeList = results.map((doc) => [doc.hour_vector]);
    });
  } else {
    await Counsellor_availability
      .find({ counsellor_user_id: counsellor_user_id, date_slot: date })
      .then((results) => {
        attributeList = results.map((doc) => [doc.date_slot_time_vector]);
      });
  }
  let messageAttributeList = await check_booking(counsellor_user_id, date, parameter, attributeList);
  console.log(messageAttributeList);
  res.json({ message: messageAttributeList });
});

router.post("/book_counsellor_appointment", async (req, res) => {
  const user_id = req.body.user_id;
  const counsellor_username = req.body.counsellor_username;
  console.log(counsellor_username);
  let date = req.body.date;
  if (date === "Monday") {
    date = getDate(date);
  } else if (date === "Tuesday") {
    date = getDate(date);
  } else if (date === "Wednesday") {
    date = getDate(date);
  } else if (date === "Thursday") {
    date = getDate(date);
  } else if (date === "Friday") {
    date = getDate(date);
  } else if (date === "Saturday") {
    date = getDate(date);
  } else if (date === "Sunday") {
    date = getDate(date);
  }
  const time = req.body.time;
  const program = req.body.program;
  const department = req.body.department;
  const hall = req.body.hall;
  const contact_number = req.body.contact_number;
  console.log(contact_number);
  const final_contact_number = Number(contact_number)
  const counsellor_user_id = (
    await User.findOne({ username: counsellor_username })
  )._id;
  const time_of_booking = new Date();
  const booking_status = 0;
  const doc = new Counsellor_Appointments({
    user_id: user_id,
    time_slot: time,
    date_slot: date,
    counsellor_user_id: counsellor_user_id,
    booking_status: booking_status,
    time_of_booking: time_of_booking,
    program: program,
    department: department,
    hall: hall,
    contact_number: final_contact_number,
  });
  doc.save();
  res.json({ message: "Appointment booked successfully" });
});

// =====================================
// COUNSELLOR USER PAGES 3
router.post("/counsellor_page_user_3", async (req, res) => {
  let patient_id = req.body.user_id;
  console.log(patient_id);
  let attributeList;
  await Counsellor_Appointments.find({ user_id: patient_id }).then(
    (results) => {
      attributeList = results.map((doc) => [
        doc.counsellor_user_id,
        doc.date_slot,
        doc.time_slot,
        doc.booking_status,
      ]);
    }
  );
  for (let i = 0; i < attributeList.length; i++) {
    let username;
    try {
      username = (await User.findOne({ _id: attributeList[i][0] })).username;
      attributeList[i][0] = username;
    } catch (err) {
      console.log(err);
    }
  }
  for (let i = 0; i < attributeList.length; i++) {
    let timimg;
    if (attributeList[i][2] < 12) timimg = attributeList[i][2] + "am";
    else timimg = attributeList[i][2] - 12 + "pm";
    attributeList[i][2] = timimg;
  }
  for (let i = 0; i < attributeList.length; i++) {
    let booking_status;
    if (attributeList[i][3] == 0) booking_status = "pending";
    else if (attributeList[i][3] == 1) booking_status = "accepted";
    else booking_status = "rejected";
    attributeList[i][3] = booking_status;
  }
  res.json({ message: attributeList });
});

module.exports = router;