const express = require("express");
const Workshop = require("../models/contentDB").sport_workshopSchema;
const Yoga_Sessions = require("../models/contentDB").yoga_sessionSchema;
const router = express.Router();

router.get("/badminton", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "badminton" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/basketball", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "basketball" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/cricket", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "cricket" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/football", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "football" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/hockey", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "hockey" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/squash", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "squash" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/table_tennis", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "table_tennis" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/tennis", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "tennis" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/volleyball", async (req, res) => {
  let attributeList;
  await Workshop.find({ type_of_sport: "volleyball" }).then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        "\n" +
        doc.time_slot_start.toString() +
        "hrs to " +
        doc.time_slot_end.toString() +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

router.get("/yoga", async (req, res) => {
  //Creating a new user
  let attributeList;
  await Yoga_Sessions.find().then((results) => {
    attributeList = results.map((doc) => [
      doc.date_slot +
        doc.time_slot_start +
        "hrs to " +
        doc.time_slot_end +
        "hrs",
      doc.content,
      doc.max_strength.toString() + " slots",
      doc.id,
      doc.participants_id,
      doc.max_strength,
    ]);
  });
  res.json({ message: attributeList });
});

module.exports = router;
