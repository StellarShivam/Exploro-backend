const Booking = require("../models/Booking");
const Payment = require("../models/paymentModel");
const Trip = require("../models/Trips");

const generateTransactionId = () => {
  return "TXN" + Date.now() + Math.random().toString(36).substr(2, 9);
};

exports.processBookingAndPayment = async (req, res) => {
  const { userId } = req.user;
  try {
    const { tripId, numberOfPeople, name, phone, totalPrice, paymentMethod } =
      req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.slots < numberOfPeople) {
      return res.status(400).json({
        success: false,
        message: "Not enough slots available",
      });
    }

    const payment = new Payment({
      trip: tripId,
      user: userId,
      amount: totalPrice,
      paymentMethod,
      transactionId: generateTransactionId(),
      paymentStatus: "pending",
    });

    const simulatePaymentSuccess = Math.random() > 0.1;

    if (!simulatePaymentSuccess) {
      payment.paymentStatus = "failed";
      await payment.save();
      return res.status(400).json({
        success: false,
        message: "Payment processing failed",
      });
    }

    const booking = new Booking({
      trip: tripId,
      user: userId,
      bookingDate: new Date(),
      noOfPeople: numberOfPeople,
      name,
      phone,
      totalPrice,
    });

    await booking.save();

    payment.booking = booking._id;
    payment.paymentStatus = "completed";
    await payment.save();

    trip.slots -= numberOfPeople;
    await trip.save();

    res.status(200).json({
      success: true,
      message: "Booking confirmed and payment processed successfully",
      data: {
        booking,
        payment,
        trip,
      },
    });
  } catch (error) {
    console.error("Booking and payment error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing booking and payment",
      error: error.message,
    });
  }
};
