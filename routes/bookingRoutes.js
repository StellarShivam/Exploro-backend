const express = require("express");
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createBooking", protect, bookingController.createBooking);

router.get("/getMyBookings", protect, bookingController.getMyBookings);

router.get("/getBooking/:bookingId", protect, bookingController.getBooking);

router.get(
  "/getTripBookings/:tripId",
  protect,
  bookingController.getTripBookings
);

module.exports = router;
