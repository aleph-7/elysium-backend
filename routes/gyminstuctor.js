const express = require("express");
const router = express.Router();

const Swim_Gym_Memberships = require("../models/bookingsDB").swim_gym_membershipsSchema;

// =====================================
// SWIM GYM INSTRUCTOR DASHBOARD
// =====================================

router.get('/swim_gym_instructor_dashboard', async (req, res) => {
  let attributeList;
  await Swim_Gym_Memberships.find({}).then((results) => {
    attributeList = results.map((doc) => [doc.user_id, doc.year, doc.month, doc.type, doc.booking_status]);
  });
  res.json({ message: attributeList });
});


router.get('/check_gym_enrollment', async (req, res) => {
  let attributeList=[];
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let headerList =[];
  headerList.push("username");
  headerList.push("year");
  headerList.push("month");
  attributeList.push(headerList);
  await Swim_Gym_Memberships.find({type: 0, booking_status: 1, year: year, month: month})
    .then((results) => {
      attributeList.push(...results.map((doc) => [doc.user_id, doc.year, doc.month]));
    })
    .catch((err) => {
      console.log(err);
  });
  for(let i = 1; i<attributeList.length; i++) {
    let username
    try {
      username=(await User.findOne({_id:attributeList[i][0]})).username;
      attributeList[i][0]=username;
    }
    catch(err) {
      console.log(err);
    }
  }
  for(let i = 1; i<attributeList.length; i++) {
    let month
    if(attributeList[i][2]==1) month="january";
    else if(attributeList[i][2]==2) month="february";
    else if(attributeList[i][2]==3) month="march";
    else if(attributeList[i][2]==4) month="april";
    else if(attributeList[i][2]==5) month="may";
    else if(attributeList[i][2]==6) month="june";
    else if(attributeList[i][2]==7) month="july";
    else if(attributeList[i][2]==8) month="august";
    else if(attributeList[i][2]==9) month="september";
    else if(attributeList[i][2]==10) month="october";
    else if(attributeList[i][2]==11) month="november";
    else if(attributeList[i][2]==12) month="december";
    attributeList[i][2]=month;
  }
  res.json({ message: attributeList });
});

router.post('/check_swim_enrollment', async (req, res) => {
  let attributeList=[];
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let headerList =[];
  headerList.push("username");
  headerList.push("year");
  headerList.push("month");
  attributeList.push(headerList);
  await Swim_Gym_Memberships.find({type: 1, booking_status: 1, year: year, month: month})
    .then((results) => {
      attributeList.push(...results.map((doc) => [doc.user_id, doc.year, doc.month]));
    })
    .catch((err) => {
      console.log(err);
  });
  for(let i = 1; i<attributeList.length; i++) {
    let username
    try {
      username
      =(await User.findOne({_id:attributeList[i][0]})).username;
      attributeList[i][0]=username;
    }
    catch(err) {
      console.log(err);
    }
  }
  for(let i = 1; i<attributeList.length; i++) {
    let month
    if(attributeList[i][2]==1) month="january";
    else if(attributeList[i][2]==2) month="february";
    else if(attributeList[i][2]==3) month="march";
    else if(attributeList[i][2]==4) month="april";
    else if(attributeList[i][2]==5) month="may";
    else if(attributeList[i][2]==6) month="june";
    else if(attributeList[i][2]==7) month="july";
    else if(attributeList[i][2]==8) month="august";
    else if(attributeList[i][2]==9) month="september";
    else if(attributeList[i][2]==10) month="october";
    else if(attributeList[i][2]==11) month="november";
    else if(attributeList[i][2]==12) month="december";
    attributeList[i][2]=month;
  }
  res.json({ message: attributeList });
});

router.get('/pending_gym_enrollment', async (req, res) => {
  let attributeList=[];
  let headerList =[];
  headerList.push("username");
  headerList.push("year");
  headerList.push("month");
  attributeList.push(headerList);
  await Swim_Gym_Memberships.find({type: 0, booking_status: 0})
    .then((results) => {
      attributeList.push(...results.map((doc) => [doc.user_id, doc.year, doc.month]));
    })
    .catch((err) => {
      console.log(err);
  });
  for(let i = 1; i<attributeList.length; i++) {
    let username
    try {
      username=(await User.findOne({_id:attributeList[i][0]})).username;
      attributeList[i][0]=username;
    }
    catch(err) {
      console.log(err);
    }
  }
  for(let i = 1; i<attributeList.length; i++) {
    let month
    if(attributeList[i][2]==1) month="january";
    else if(attributeList[i][2]==2) month="february";
    else if(attributeList[i][2]==3) month="march";
    else if(attributeList[i][2]==4) month="april";
    else if(attributeList[i][2]==5) month="may";
    else if(attributeList[i][2]==6) month="june";
    else if(attributeList[i][2]==7) month="july";
    else if(attributeList[i][2]==8) month="august";
    else if(attributeList[i][2]==9) month="september";
    else if(attributeList[i][2]==10) month="october";
    else if(attributeList[i][2]==11) month="november";
    else if(attributeList[i][2]==12) month="december";
    attributeList[i][2]=month;
  }
  res.json({ message: attributeList });
});

router.post('/accept_gym_enrollment', async (req, res) =>{
  let username=req.body.username;
  let year=req.body.year;
  let month=req.body.month;
  console.log(username);
  console.log(year);
  console.log(month);
  if(month==="january") month=1;
  else if(month==="february") month=2;
  else if(month==="march") month=3;
  else if(month==="april") month=4;
  else if(month==="may") month=5;
  else if(month==="june") month=6;
  else if(month==="july") month=7;
  else if(month==="august") month=8;
  else if(month==="september") month=9;
  else if(month==="october") month=10;
  else if(month==="november") month=11;
  else if(month==="december") month=12;
  try
  {
    let user_id=(await User.findOne({username:username}))._id;
    let doc = await Swim_Gym_Memberships.findOne({user_id:user_id, year:year, month:month, type:0});
    console.log(doc);
    doc.booking_status=1;
    doc.save();
  }
  catch(err)
  {
    console.log(err);
  }
  res.json({ message: "Enrollment accepted successfully" });
});

router.post('/accept_swim_enrollment', async (req, res) =>{
  let username=req.body.username;
  let year=req.body.year;
  let month=req.body.month;
  console.log(username);
  console.log(year);
  console.log(month);
  if(month==="january") month=1;
  else if(month==="february") month=2;
  else if(month==="march") month=3;
  else if(month==="april") month=4;
  else if(month==="may") month=5;
  else if(month==="june") month=6;
  else if(month==="july") month=7;
  else if(month==="august") month=8;
  else if(month==="september") month=9;
  else if(month==="october") month=10;
  else if(month==="november") month=11;
  else if(month==="december") month=12;
  try
  {
    let user_id=(await User.findOne({username:username}))._id;
    let doc = await Swim_Gym_Memberships.findOne({user_id:user_id, year:year, month:month, type:1});
    console.log(doc);
    doc.booking_status=1;
    doc.save();
  }
  catch(err)
  {
    console.log(err);
  }
  res.json({ message: "Enrollment accepted successfully" });
});


router.get('/get_statistics', async (req, res) => {
  let attributeList=[];
  let bookingJanuary=0;
  let bookingFebruary=0;
  let bookingMarch=0;
  let bookingApril=0;
  let bookingMay=0;
  let bookingJune=0;
  let bookingJuly=0;
  let bookingAugust=0;
  let bookingSeptember=0;
  let bookingOctober=0;
  let bookingNovember=0;
  let bookingDecember=0;

  let totalApplied=0;
  let totalAccepted=0;
  let totalRejected=0;
  let totalPending=0;

  await Swim_Gym_Memberships.find({type: 0})
    .then((results) => {
      attributeList.push(...results.map((doc) => [doc.user_id, doc.month, doc.booking_status]));
    })
    .catch((err) => {
      console.log(err);
  });

  finalAttributeList=[];
  let header=[];
  header.push("Metric");
  header.push("Value");
  finalAttributeList.push(header);
  let headerMonth_1=[];
  headerMonth_1.push("January");
  finalAttributeList.push(headerMonth_1);
  let headerMonth_2=[];
  headerMonth_2.push("February");
  finalAttributeList.push(headerMonth_2);
  let headerMonth_3=[];
  headerMonth_3.push("March");
  finalAttributeList.push(headerMonth_3);
  let headerMonth_4=[];
  headerMonth_4.push("April");
  finalAttributeList.push(headerMonth_4);
  let headerMonth_5=[];
  headerMonth_5.push("May");
  finalAttributeList.push(headerMonth_5);
  let headerMonth_6=[];
  headerMonth_6.push("June");
  finalAttributeList.push(headerMonth_6);
  let headerMonth_7=[];
  headerMonth_7.push("July");
  finalAttributeList.push(headerMonth_7);
  let headerMonth_8=[];
  headerMonth_8.push("August");
  finalAttributeList.push(headerMonth_8);
  let headerMonth_9=[];
  headerMonth_9.push("September");
  finalAttributeList.push(headerMonth_9);
  let headerMonth_10=[];
  headerMonth_10.push("October");
  finalAttributeList.push(headerMonth_10);
  let headerMonth_11=[];
  headerMonth_11.push("November");
  finalAttributeList.push(headerMonth_11);
  let headerMonth_12=[];
  headerMonth_12.push("December");
  finalAttributeList.push(headerMonth_12);
  let headerTotalApplied=[];
  headerTotalApplied.push("Total Applied");
  finalAttributeList.push(headerTotalApplied);
  let headerTotalAccepted=[];
  headerTotalAccepted.push("Total Accepted");
  finalAttributeList.push(headerTotalAccepted);
  let headerTotalRejected=[];
  headerTotalRejected.push("Total Rejected");
  finalAttributeList.push(headerTotalRejected);
  let headerTotalPending=[];
  headerTotalPending.push("Total Pending");
  finalAttributeList.push(headerTotalPending);

  for(i=0;i<attributeList.length;i++)
  {
    if(attributeList[i][1]==1)
    {
      bookingJanuary++;
    }
    else if(attributeList[i][1]==2)
    {
      bookingFebruary++;
    }
    else if(attributeList[i][1]==3)
    {
      bookingMarch++;
    }
    else if(attributeList[i][1]==4)
    {
      bookingApril++;
    }
    else if(attributeList[i][1]==5)
    {
      bookingMay++;
    }
    else if(attributeList[i][1]==6)
    {
      bookingJune++;
    }
    else if(attributeList[i][1]==7)
    {
      bookingJuly++;
    }
    else if(attributeList[i][1]==8)
    {
      bookingAugust++;
    }
    else if(attributeList[i][1]==9)
    {
      bookingSeptember++;
    }
    else if(attributeList[i][1]==10)
    {
      bookingOctober++;
    }
    else if(attributeList[i][1]==11)
    {
      bookingNovember++;
    }
    else if(attributeList[i][1]==12)
    {
      bookingDecember++;
    }
    if(attributeList[i][2]==0) totalPending++;
    else if(attributeList[i][2]==1) totalAccepted++;
    else totalRejected++;
    totalApplied++;
  }
  finalAttributeList[1].push(bookingJanuary);
  finalAttributeList[2].push(bookingFebruary);
  finalAttributeList[3].push(bookingMarch);
  finalAttributeList[4].push(bookingApril);
  finalAttributeList[5].push(bookingMay);
  finalAttributeList[6].push(bookingJune);
  finalAttributeList[7].push(bookingJuly);
  finalAttributeList[8].push(bookingAugust);
  finalAttributeList[9].push(bookingSeptember);
  finalAttributeList[10].push(bookingOctober);
  finalAttributeList[11].push(bookingNovember);
  finalAttributeList[12].push(bookingDecember);
  finalAttributeList[13].push(totalApplied);
  finalAttributeList[14].push(totalAccepted);
  finalAttributeList[15].push(totalRejected);
  finalAttributeList[1].push(totalPending);

  res.json({ message: finalAttributeList });
});


module.exports = router;
