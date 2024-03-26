const express = require("express");
const Tutorial = require("../models/contentDB").tutorialSchema;
const router = express.Router();

router.get("/badminton", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "badminton" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/basketball", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "basketball" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/cricket", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "cricket" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/football", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "football" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/gym", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "gym" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/hockey", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "hockey" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/squash", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "squash" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/swimming", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "swimming" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/table_tennis", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "table_tennis" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/tennis", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "tennis" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/volleyball", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "volleyball" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

router.get("/yoga", async (req, res) => {
  let attributeList;
  await Tutorial.find({ type_of_sport: "yoga" }).then((results) => {
    attributeList = results.map((doc) => [doc.title, doc.source, doc.link]);
  });
  res.json({ message: attributeList });
});

module.exports = router;
