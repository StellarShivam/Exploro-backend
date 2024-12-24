const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Trip" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  noOfPeople: { type: Number, required: true, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
