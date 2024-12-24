const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Booking",
  },
  trip: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Trip" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "upi", "net_banking"],
    required: true,
  },
  transactionId: { type: String, required: true, unique: true },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);

module.exports = PaymentModel;
