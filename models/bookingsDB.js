const { default: mongoose } = require("mongoose");
mongoose.pluralize(null);
const { connectBookingsDBs } = require("../databases/bookingsDB");

const sportBookingSchema = mongoose.Schema({
  show_up_status: Number,
  user_id: mongoose.ObjectId,
  time_slot: Number,
  type_of_sport: String,
  time_of_booking: Date,
  booking_status: Number,
  type_of_booking: Number,
  date_slot: String,
  partners_id: [mongoose.ObjectId],
  no_partners: Number,
  court_id: mongoose.ObjectId,
});
const counsellor_appointmentsSchema = mongoose.Schema({
  user_id: mongoose.ObjectId,
  time_slot: Number,
  date_slot: String,
  counsellor_user_id: mongoose.ObjectId,
  booking_status: Number,
  time_of_booking: Date,
  program: String,
  department: String,
  hall: Number,
  contact_number: String,
});

const swim_gym_membershipsSchema = mongoose.Schema({
  user_id: mongoose.ObjectId,
  time_slot: Number,
  type: Number,
  year: Number,
  month: Number,
  booking_status: Number,
  time_of_booking: Date,
});

const { bookingDB } = connectBookingsDBs();
module.exports = {
  sportBookingsSchema: bookingDB.model("sport_bookings", sportBookingSchema),
  counsellorAppointmentsSchema: bookingDB.model(
    "counsellor_appointments",
    counsellor_appointmentsSchema
  ),
  swimGymMembershipsSchema: bookingDB.model(
    "swim_gym_memberships",
    swim_gym_membershipsSchema
  ),
};
