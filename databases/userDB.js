const mongoose = require("mongoose");
mongoose.pluralize(null);
require("dotenv").config();

const connectUserDB = () => {
  try {
    const userDB = mongoose.createConnection(process.env.MONGODB_User);
    console.log("User DB Connected");
    return { userDB };
  } catch (error) {
    console.error("Error: $(error.message)");
    process.exit(1);
  }
};
module.exports = { connectUserDB };
