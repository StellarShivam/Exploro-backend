const express = require("express");
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/makePayment",
  protect,
  paymentController.processBookingAndPayment
);

module.exports = router;
