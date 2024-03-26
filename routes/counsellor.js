const express = require("express");
const router = express.Router();

const Blog = require("./../models/contentDB").blog_counsellorSchema;
const Availability = require("./../models/contentDB").counsellor_availabilitySchema;
const Counsellor_Appointments = require("./../models/bookingsDB").counsellorAppointmentsSchema;
const User = require("./../models/userDB").userSchema;


//ARUSHU's playground

router.post("/postBlog", async (req, res) => {
    try {
      const new_blog = new Blog({
        content: req.body.content,
        title: req.body.title,
        counsellor_username: req.body.counsellor_username,
      });
      console.log(new_blog);
      const doc = await new_blog.save();
      //Sending the response to the frontend
      res.status(200).json({ message: "Blog posted successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Blog posting failed" });
    }
  });
router.post("/availability", async (req, res) => {
    try {
        const new_availabilty = new Availability({
        day_vector: req.body.day_vector,
        hour_vector: req.body.hour_vector,
        date_slot: req.body.date_slot,
        date_slot_time_vector: req.body.date_slot_time_vector,
        counsellor_user_id: req.body.counsellor_user_id,
        });
        console.log(new_availabilty);
        const doc = await new_availabilty.save();
        //Sending the response to the frontend
        res.status(200).json({ message: "Availability updated successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availabilty updating failed" });
    }
});

router.post("/deleteDayAvailability", async (req, res) => {
    try {
        const counsellor_user_id = req.body.counsellor_user_id;
        // console.log(counsellor_user_id);
        try {
        const deletedRecord = await Availability.findOneAndDelete({
            day_vector: { $elemMatch: { $ne: 0 } },
            counsellor_user_id: counsellor_user_id,
        });

        if (deletedRecord) {
            console.log("Deleted record:", deletedRecord);
        } else {
            console.log("No record found matching the deletion condition.");
        }
        } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availabilty deletion failed" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availabilty updating failed" });
    }
});
router.post("/deleteDateAvailability", async (req, res) => {
    try {
        const counsellor_user_id = req.body.counsellor_user_id;
        const date_slot = req.body.date_slot;
        // console.log(date_slot);
        try {
        const deletedRecord = await Availability.findOneAndDelete({
            date_slot: date_slot,
            counsellor_user_id: counsellor_user_id,
        });
        // console.log("why is this called");
        if (deletedRecord) {
            console.log("Deleted record:", deletedRecord);
        } else {
            console.log("No record found matching the date slot.");
        }
        } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availabilty deletion failed" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availabilty updating failed" });
    }
});

router.post("/acceptAppointments", async (req, res) => {
    console.log(req.body);
    const booking_status = req.body.isAccept;
    const appointment_id = req.body.appointment_id;
    console.log("fml");
    try {
        const appointment = await Counsellor_Appointments.findById(appointment_id);
        //  .then(console.log(appointment));

        if (!appointment) {
        console.log("Appointment not found");
        return res
            .status(404)
            .json({ success: false, message: "Appointment not found" });
        }
        const updateAppointment = await Counsellor_Appointments.findByIdAndUpdate(
        appointment_id,
        {
            //  $inc: { max_strength: -1 }, // Decrease max_strength by 1
            booking_status: booking_status,
        },
        { new: true }
        );
        if (updateAppointment) {
        console.log("Appointment updated successfully:", updateAppointment);
        res
            .status(200)
            .json({ success: true, message: "Appointment updated successfully" });
        } else {
        console.log("Appointment not found");
        res
            .status(404)
            .json({ success: false, message: "Appointment not found" });
        }
    } catch (error) {
        console.error("Error updating Appointment:", error);
        res
        .status(500)
        .json({ success: false, message: "Error updating Appointment" });
    }
});

router.post("/getAppointments", async (req, res) => {
    let attributeList;
    var finalattributeList = [];
    const counsellor_user_id = req.body.counsellor_user_id;
    try {
        // console.log("boo");
        // const records = await Appointment.find({counsellor_user_id : '65f449fd23c3a6138c0daca3'});
        const records = await Counsellor_Appointments.find({
        counsellor_user_id: counsellor_user_id,
        }).then((results) => {
        attributeList = results.map((doc) => ({
            booking_id: doc._id,
            user_id: doc.user_id,
            time_slot: doc.time_slot, //time at which appointment begins
            date_slot: doc.date_slot, // date in string format
            booking_status: doc.booking_status, // -1: rejected 0: pending 1: accepted
        }));
        });
        for (let i = 0; i < attributeList.length; i++) {
        let user_id = attributeList[i].user_id;
        console.log(user_id);
        try {
            let user_name = await User.findOne({ _id: user_id });
            if (!user_name) {
            console.log("Anonymous");
            finalattributeList.push({
                username: "Anonymous",
                time_slot: attributeList[i].time_slot,
                date_slot: attributeList[i].date_slot,
                booking_status: attributeList[i].booking_status,
                booking_id: attributeList[i].booking_id,
            });
            } else {
            console.log(user_name.username);
            finalattributeList.push({
                username: user_name.username,
                time_slot: attributeList[i].time_slot,
                date_slot: attributeList[i].date_slot,
                booking_status: attributeList[i].booking_status,
                booking_id: attributeList[i].booking_id,
            });
            }
        } catch (err) {
            console.log(err);
        }
        }

        // console.log(attributeList);
        res.status(200).json({ message: finalattributeList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Unable to fetch Appointments" });
    }
});

router.post("/getAvailability", async (req, res) => {
    let attributeList;
    const counsellor_user_id = req.body.counsellor_user_id;
    try {
        const records = await Availability.find({
        counsellor_user_id: counsellor_user_id,
        }).then((results) => {
        attributeList = results.map((doc) => ({
            date_slot: doc.date_slot,
            date_slot_time_vector: doc.date_slot_time_vector,
            day_vector: doc.day_vector,
            hour_vector: doc.hour_vector,
        }));
        });
        res.status(200).json({ message: attributeList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Availabilty fetching" });
    }
});




module.exports = router;
