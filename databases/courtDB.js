const mongoose = require("mongoose");
mongoose.pluralize(null);
require("dotenv").config();

const connectCourtsDBs = () => {
  try {
    const CourtDB = mongoose.createConnection(process.env.MONGODB_Court);
    console.log("Courts DB Connected");
    return { CourtDB };
  } catch (error) {
    console.error("Error: $(error.message)");
    process.exit(1);
  }
};
module.exports = { connectCourtsDBs };
