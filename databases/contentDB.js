const mongoose = require("mongoose");
mongoose.pluralize(null);
require("dotenv").config();

const connectContentDBs = () => {
  try {
    const contentDB = mongoose.createConnection(process.env.MONGODB_Content);
    console.log("Content DB Connected");
    return { contentDB };
  } catch (error) {
    console.error("Error: $(error.message)");
    process.exit(1);
  }
};
module.exports = { connectContentDBs };
