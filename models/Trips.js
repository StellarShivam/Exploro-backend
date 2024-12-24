const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  location: String,
  photos: [String],
  description: String,
  perks: [String],
  cancellationPolicy: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  slots: Number,
  price: Number,
});

const TripModel = mongoose.model("Trip", tripSchema);

module.exports = TripModel;
