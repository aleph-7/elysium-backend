const mongoose = require("mongoose");
mongoose.pluralize(null);
require("dotenv").config();

const connectBookingsDBs = () => {
  try {
    const bookingDB = mongoose.createConnection(process.env.MONGODB_Booking);
    console.log("Bookings DB Connected");
    return { bookingDB };
  } catch (error) {
    console.error("Error: $(error.message)");
    process.exit(1);
  }
};
module.exports = { connectBookingsDBs };
