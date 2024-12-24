const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Trip" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookingDate: { type: Date, required: true },
  noOfPeople: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  totalPrice: Number,
});

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
