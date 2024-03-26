const express = require("express");
const Workshop = require("../models/contentDB").sport_workshopSchema;
const router = express.Router();

router.post("/badminton", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/basketball", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/cricket", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/volleyball", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/tennis", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/table_tennis", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/swimming", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/squash", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/football", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/hockey", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/yoga", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

router.post("/gym", async (req, res) => {
  console.log(req.body);
  const workshopId = req.body.workshopId;
  const userId = req.body.userId;
  try {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      console.log("Workshop not found");
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });
    }

    // Check if max_strength is greater than 0
    if (workshop.max_strength <= 0) {
      console.log("Workshop max_strength reached");
      return res.status(400).json({
        success: false,
        message: "Workshop max_strength reached, cannot apply",
      });
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        $inc: { max_strength: -1 }, // Decrease max_strength by 1
        $addToSet: { participants_id: userId }, // Add userId to participant_id array
      },
      { new: true }
    );
    if (updatedWorkshop) {
      console.log("Workshop updated successfully:", updatedWorkshop);
      res
        .status(200)
        .json({ success: true, message: "Workshop updated successfully" });
    } else {
      console.log("Workshop not found");
      res.status(404).json({ success: false, message: "Workshop not found" });
    }
  } catch (error) {
    console.error("Error updating workshop:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating workshop" });
  }
});

module.exports = router;
