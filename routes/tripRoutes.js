const express = require("express");
const tripControllers = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createTrip", protect, tripControllers.createTrip);

router.get("/getAllTrips", tripControllers.getAllTrips);

router.get("/getMyTrips", protect, tripControllers.getMyTrips);

router.get("/getTrip/:tripId", tripControllers.getTrip);

router.put("/update/:tripId", protect, tripControllers.updateTrip);

router.delete("/deleteTrip/:tripId", protect, tripControllers.deleteTrip);

module.exports = router;
